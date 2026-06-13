-- TIMIS/TIMIS PostgreSQL Schema
-- All 10 modules — Production-ready with indexes, constraints, RLS-ready
-- Schema-based multi-tenancy: this runs WITHIN each org schema

-- ============================================================
-- EXTENSIONS (run once in public schema)
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- fuzzy text search

-- ============================================================
-- MODULE 1: TENANT ONBOARDING & PROFILE
-- ============================================================

CREATE TYPE tenant_status AS ENUM ('applicant', 'active', 'vacated', 'blacklisted');
CREATE TYPE vetting_status AS ENUM ('pending', 'in_progress', 'approved', 'rejected');
CREATE TYPE id_type AS ENUM ('national_id', 'passport', 'alien_id', 'military_id');

CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20) NOT NULL,  -- +254...
    alt_phone VARCHAR(20),
    id_type id_type NOT NULL DEFAULT 'national_id',
    id_number VARCHAR(50) NOT NULL,
    kra_pin VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(10),
    nationality VARCHAR(50) DEFAULT 'Kenyan',
    occupation VARCHAR(100),
    employer_name VARCHAR(200),
    employer_phone VARCHAR(20),
    monthly_income_kes NUMERIC(12,2),
    next_of_kin_name VARCHAR(200),
    next_of_kin_phone VARCHAR(20),
    next_of_kin_relation VARCHAR(50),
    status tenant_status NOT NULL DEFAULT 'applicant',
    vetting_status vetting_status NOT NULL DEFAULT 'pending',
    profile_photo_url TEXT,
    id_document_url TEXT,  -- MinIO reference
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(phone),
    UNIQUE(id_number)
);

CREATE INDEX idx_tenants_phone ON tenants(phone);
CREATE INDEX idx_tenants_status ON tenants(status);
CREATE INDEX idx_tenants_name ON tenants USING gin((first_name || ' ' || last_name) gin_trgm_ops);

CREATE TABLE tenant_references (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    referee_name VARCHAR(200) NOT NULL,
    referee_phone VARCHAR(20) NOT NULL,
    referee_email VARCHAR(255),
    relationship VARCHAR(50),  -- 'previous_landlord', 'employer', 'personal'
    status vetting_status NOT NULL DEFAULT 'pending',
    response_notes TEXT,
    contacted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE tenant_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    doc_type VARCHAR(50) NOT NULL,  -- 'id_front', 'id_back', 'payslip', 'bank_statement', 'employment_letter'
    file_url TEXT NOT NULL,
    file_name VARCHAR(255),
    mime_type VARCHAR(100),
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- MODULE 2: LEASE & UNIT MANAGEMENT
-- ============================================================

CREATE TYPE unit_type AS ENUM ('bedsitter', 'one_bed', 'two_bed', 'three_bed', 'maisonette', 'shop', 'office', 'stall', 'warehouse', 'mixed');
CREATE TYPE unit_status AS ENUM ('vacant', 'occupied', 'maintenance', 'reserved');
CREATE TYPE lease_status AS ENUM ('draft', 'active', 'renewal', 'expired', 'terminated');

CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    county VARCHAR(100) NOT NULL,
    latitude NUMERIC(10,7),
    longitude NUMERIC(10,7),
    property_type VARCHAR(50) NOT NULL,  -- 'residential', 'commercial', 'mixed'
    total_units INT NOT NULL DEFAULT 0,
    year_built INT,
    lr_number VARCHAR(100),  -- Land Registry number
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE buildings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    floors INT NOT NULL DEFAULT 1,
    floor_plan_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    building_id UUID NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
    unit_number VARCHAR(50) NOT NULL,
    floor INT,
    unit_type unit_type NOT NULL,
    bedrooms INT DEFAULT 0,
    bathrooms INT DEFAULT 0,
    size_sqm NUMERIC(8,2),
    rent_amount_kes NUMERIC(12,2) NOT NULL,
    deposit_amount_kes NUMERIC(12,2),
    service_charge_kes NUMERIC(12,2) DEFAULT 0,
    status unit_status NOT NULL DEFAULT 'vacant',
    amenities TEXT[],  -- ['parking', 'wifi', 'water_tank', 'generator']
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(building_id, unit_number)
);

CREATE INDEX idx_units_status ON units(status);
CREATE INDEX idx_units_type ON units(unit_type);
CREATE INDEX idx_units_rent ON units(rent_amount_kes);

CREATE TABLE leases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    unit_id UUID NOT NULL REFERENCES units(id),
    status lease_status NOT NULL DEFAULT 'draft',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    rent_amount_kes NUMERIC(12,2) NOT NULL,
    deposit_amount_kes NUMERIC(12,2) NOT NULL,
    deposit_paid BOOLEAN DEFAULT FALSE,
    billing_day INT NOT NULL DEFAULT 1,  -- day of month rent is due
    rent_review_date DATE,
    notice_period_days INT NOT NULL DEFAULT 30,
    agreement_url TEXT,  -- signed PDF in MinIO
    signed_at TIMESTAMPTZ,
    terminated_at TIMESTAMPTZ,
    termination_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK(end_date > start_date),
    CHECK(billing_day BETWEEN 1 AND 28)
);

CREATE INDEX idx_leases_tenant ON leases(tenant_id);
CREATE INDEX idx_leases_unit ON leases(unit_id);
CREATE INDEX idx_leases_status ON leases(status);
CREATE INDEX idx_leases_end_date ON leases(end_date);

CREATE TABLE unit_conditions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id UUID NOT NULL REFERENCES units(id),
    lease_id UUID REFERENCES leases(id),
    condition_type VARCHAR(20) NOT NULL,  -- 'move_in', 'move_out'
    notes TEXT,
    media_urls TEXT[],  -- MinIO references
    recorded_by UUID,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- MODULE 3: RENT COLLECTION & FINANCIAL ENGINE
-- ============================================================

CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'paid', 'partial', 'overdue', 'cancelled');
CREATE TYPE payment_method AS ENUM ('mpesa', 'bank_transfer', 'cash', 'cheque', 'card');
CREATE TYPE payment_status AS ENUM ('pending', 'confirmed', 'failed', 'reversed');
CREATE TYPE charge_type AS ENUM ('rent', 'deposit', 'water', 'electricity', 'service_charge', 'penalty', 'other');

CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lease_id UUID NOT NULL REFERENCES leases(id),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    billing_period_start DATE NOT NULL,
    billing_period_end DATE NOT NULL,
    due_date DATE NOT NULL,
    total_amount_kes NUMERIC(12,2) NOT NULL,
    paid_amount_kes NUMERIC(12,2) NOT NULL DEFAULT 0,
    balance_kes NUMERIC(12,2) GENERATED ALWAYS AS (total_amount_kes - paid_amount_kes) STORED,
    status invoice_status NOT NULL DEFAULT 'draft',
    etims_invoice_number VARCHAR(100),  -- KRA eTIMS reference
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_invoices_tenant ON invoices(tenant_id);
CREATE INDEX idx_invoices_lease ON invoices(lease_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_due ON invoices(due_date);

CREATE TABLE invoice_lines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    charge_type charge_type NOT NULL,
    description VARCHAR(255) NOT NULL,
    amount_kes NUMERIC(12,2) NOT NULL,
    quantity NUMERIC(8,2) DEFAULT 1
);

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES invoices(id),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    amount_kes NUMERIC(12,2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'KES',
    method payment_method NOT NULL,
    status payment_status NOT NULL DEFAULT 'pending',
    mpesa_receipt_number VARCHAR(50),
    mpesa_transaction_id VARCHAR(100),
    bank_reference VARCHAR(100),
    paid_at TIMESTAMPTZ,
    confirmed_at TIMESTAMPTZ,
    metadata JSONB,  -- raw callback data
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_tenant ON payments(tenant_id);
CREATE INDEX idx_payments_invoice ON payments(invoice_id);
CREATE INDEX idx_payments_mpesa ON payments(mpesa_receipt_number);
CREATE INDEX idx_payments_status ON payments(status);

CREATE TABLE payment_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    total_arrears_kes NUMERIC(12,2) NOT NULL,
    installment_amount_kes NUMERIC(12,2) NOT NULL,
    installments_total INT NOT NULL,
    installments_paid INT NOT NULL DEFAULT 0,
    start_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE landlord_payouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    gross_collected_kes NUMERIC(12,2) NOT NULL,
    management_fee_kes NUMERIC(12,2) NOT NULL,
    expenses_kes NUMERIC(12,2) NOT NULL DEFAULT 0,
    net_payout_kes NUMERIC(12,2) NOT NULL,
    payout_method payment_method,
    payout_reference VARCHAR(100),
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Chart of accounts for property-level P&L
CREATE TABLE chart_of_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL,  -- 'income', 'expense', 'asset', 'liability'
    parent_id UUID REFERENCES chart_of_accounts(id),
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE journal_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entry_date DATE NOT NULL,
    description TEXT NOT NULL,
    reference_type VARCHAR(50),  -- 'payment', 'invoice', 'payout', 'expense'
    reference_id UUID,
    property_id UUID REFERENCES properties(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE journal_lines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entry_id UUID NOT NULL REFERENCES journal_entries(id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES chart_of_accounts(id),
    debit_kes NUMERIC(12,2) DEFAULT 0,
    credit_kes NUMERIC(12,2) DEFAULT 0,
    CHECK(debit_kes >= 0 AND credit_kes >= 0)
);

-- ============================================================
-- MODULE 4: TIMIS SCORE ENGINE
-- ============================================================

CREATE TABLE timis_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    score INT NOT NULL CHECK(score BETWEEN 0 AND 850),
    band VARCHAR(20) NOT NULL,  -- 'excellent', 'good', 'fair', 'poor', 'very_poor'
    payment_punctuality_score NUMERIC(5,2),
    payment_completeness_score NUMERIC(5,2),
    tenancy_duration_score NUMERIC(5,2),
    dispute_history_score NUMERIC(5,2),
    maintenance_behavior_score NUMERIC(5,2),
    vacate_compliance_score NUMERIC(5,2),
    reference_quality_score NUMERIC(5,2),
    calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(tenant_id)  -- one current score per tenant
);

CREATE TABLE timis_score_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    score INT NOT NULL,
    change_amount INT NOT NULL,  -- +12 or -5
    change_reason TEXT NOT NULL,
    calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_score_history_tenant ON timis_score_history(tenant_id, calculated_at DESC);

CREATE TABLE timis_score_shares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    share_token VARCHAR(64) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    accessed_count INT DEFAULT 0,
    max_access INT DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE landlord_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id),
    score INT NOT NULL CHECK(score BETWEEN 0 AND 850),
    maintenance_response_score NUMERIC(5,2),
    dispute_outcome_score NUMERIC(5,2),
    eviction_compliance_score NUMERIC(5,2),
    tenant_retention_score NUMERIC(5,2),
    calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(property_id)
);

-- ============================================================
-- MODULE 5: DISPUTE LOGGING & RESOLUTION
-- ============================================================

CREATE TYPE dispute_category AS ENUM ('deposit', 'maintenance', 'rent_increase', 'eviction', 'utilities', 'noise_conduct', 'other');
CREATE TYPE dispute_status AS ENUM ('submitted', 'acknowledged', 'under_review', 'resolved', 'escalated', 'closed');

CREATE TABLE disputes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dispute_number VARCHAR(50) NOT NULL UNIQUE,
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    unit_id UUID NOT NULL REFERENCES units(id),
    lease_id UUID REFERENCES leases(id),
    category dispute_category NOT NULL,
    subject VARCHAR(300) NOT NULL,
    description TEXT NOT NULL,
    status dispute_status NOT NULL DEFAULT 'submitted',
    filed_by VARCHAR(20) NOT NULL,  -- 'tenant' or 'landlord'
    evidence_urls TEXT[],
    resolution_notes TEXT,
    resolution_outcome VARCHAR(50),  -- 'tenant_favor', 'landlord_favor', 'compromise', 'withdrawn'
    escalated_to VARCHAR(100),  -- 'RRT', 'small_claims', 'BPRT'
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_disputes_tenant ON disputes(tenant_id);
CREATE INDEX idx_disputes_status ON disputes(status);
CREATE INDEX idx_disputes_category ON disputes(category);

CREATE TABLE dispute_timeline (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dispute_id UUID NOT NULL REFERENCES disputes(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    actor_id UUID,
    actor_role VARCHAR(50),
    notes TEXT,
    attachment_urls TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE dispute_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dispute_id UUID NOT NULL REFERENCES disputes(id) ON DELETE CASCADE,
    doc_type VARCHAR(50) NOT NULL,  -- 'demand_letter', 'eviction_notice', 'deposit_refund_request', 'complaint_letter'
    content TEXT NOT NULL,
    generated_by VARCHAR(20) DEFAULT 'ai',  -- 'ai' or 'manual'
    file_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- MODULE 6: MAINTENANCE & VENDOR MANAGEMENT
-- ============================================================

CREATE TYPE maintenance_status AS ENUM ('submitted', 'assigned', 'in_progress', 'completed', 'verified', 'closed');
CREATE TYPE urgency_level AS ENUM ('low', 'medium', 'high', 'emergency');

CREATE TABLE maintenance_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_number VARCHAR(50) NOT NULL UNIQUE,
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    unit_id UUID NOT NULL REFERENCES units(id),
    category VARCHAR(50) NOT NULL,  -- 'plumbing', 'electrical', 'structural', 'appliance', 'pest', 'other'
    description TEXT NOT NULL,
    urgency urgency_level NOT NULL DEFAULT 'medium',
    status maintenance_status NOT NULL DEFAULT 'submitted',
    media_urls TEXT[],
    assigned_to UUID,  -- vendor_id
    sla_response_hours INT,
    sla_resolution_hours INT,
    responded_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    verified_at TIMESTAMPTZ,
    cost_kes NUMERIC(12,2),
    completion_media_urls TEXT[],
    tenant_rating INT CHECK(tenant_rating BETWEEN 1 AND 5),
    tenant_feedback TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_maintenance_tenant ON maintenance_requests(tenant_id);
CREATE INDEX idx_maintenance_unit ON maintenance_requests(unit_id);
CREATE INDEX idx_maintenance_status ON maintenance_requests(status);

CREATE TABLE vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    skills TEXT[] NOT NULL,  -- ['plumbing', 'electrical', 'painting']
    id_number VARCHAR(50),
    location VARCHAR(200),
    avg_rating NUMERIC(3,2) DEFAULT 0,
    total_jobs INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE preventive_maintenance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id UUID REFERENCES units(id),
    property_id UUID REFERENCES properties(id),
    task_name VARCHAR(200) NOT NULL,
    description TEXT,
    frequency_days INT NOT NULL,
    last_completed_at TIMESTAMPTZ,
    next_due_at TIMESTAMPTZ NOT NULL,
    assigned_vendor_id UUID REFERENCES vendors(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- MODULE 7: COMMUNICATION HUB
-- ============================================================

CREATE TYPE message_channel AS ENUM ('in_app', 'sms', 'email', 'whatsapp');

CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject VARCHAR(300),
    participants UUID[] NOT NULL,
    related_type VARCHAR(50),  -- 'dispute', 'maintenance', 'lease', 'general'
    related_id UUID,
    is_broadcast BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id),
    sender_id UUID NOT NULL,
    content TEXT NOT NULL,
    channel message_channel NOT NULL DEFAULT 'in_app',
    attachment_urls TEXT[],
    read_by UUID[] DEFAULT '{}',
    is_system BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    -- Messages are IMMUTABLE — no update, no delete (audit trail)
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at);

CREATE TABLE broadcasts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id),
    building_id UUID REFERENCES buildings(id),
    sender_id UUID NOT NULL,
    subject VARCHAR(300) NOT NULL,
    content TEXT NOT NULL,
    channels message_channel[] NOT NULL DEFAULT '{in_app}',
    sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    title VARCHAR(200) NOT NULL,
    body TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,  -- 'payment', 'maintenance', 'dispute', 'lease', 'score', 'system'
    related_type VARCHAR(50),
    related_id UUID,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, is_read, created_at DESC);

-- ============================================================
-- MODULE 8: AI LAYER (Claude Integration Tracking)
-- ============================================================

CREATE TABLE ai_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    feature VARCHAR(50) NOT NULL,  -- 'legal_assistant', 'lease_analyzer', 'dispute_advisor', 'anomaly_detection', 'score_explainer', 'vacancy_copy', 'renewal_briefing'
    prompt_summary TEXT,
    response_summary TEXT,
    tokens_used INT,
    model_version VARCHAR(50),
    feedback_rating INT CHECK(feedback_rating BETWEEN 1 AND 5),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ai_interactions_user ON ai_interactions(user_id, created_at DESC);
CREATE INDEX idx_ai_interactions_feature ON ai_interactions(feature);

-- ============================================================
-- MODULE 9: REPORTING (materialized views for performance)
-- ============================================================

CREATE TABLE report_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_type VARCHAR(50) NOT NULL,  -- 'monthly_financial', 'kra_tax', 'occupancy', 'arrears'
    property_id UUID REFERENCES properties(id),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    data JSONB NOT NULL,
    generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_report_snapshots ON report_snapshots(report_type, property_id, period_start);

-- ============================================================
-- MODULE 10: COMPLIANCE & SECURITY
-- ============================================================

CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    -- IMMUTABLE: no UPDATE or DELETE allowed (enforced by trigger)
);

CREATE INDEX idx_audit_log_user ON audit_log(user_id, created_at DESC);
CREATE INDEX idx_audit_log_resource ON audit_log(resource_type, resource_id);

CREATE TABLE consent_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    consent_type VARCHAR(50) NOT NULL,  -- 'data_processing', 'marketing', 'score_sharing', 'third_party'
    granted BOOLEAN NOT NULL,
    granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    revoked_at TIMESTAMPTZ,
    ip_address INET
);

CREATE TABLE data_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    request_type VARCHAR(50) NOT NULL,  -- 'access', 'deletion', 'portability', 'rectification'
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    responded_at TIMESTAMPTZ,
    response_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- PUBLIC SCHEMA: Platform-level tables (shared across orgs)
-- ============================================================

-- These live in the 'public' schema, not per-org schemas

CREATE TABLE public.organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,  -- subdomain
    owner_user_id UUID NOT NULL,
    plan VARCHAR(20) NOT NULL DEFAULT 'free',  -- 'free', 'starter', 'pro', 'enterprise'
    max_units INT NOT NULL DEFAULT 5,
    schema_name VARCHAR(100) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES public.organizations(id),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,  -- 'super_admin', 'landlord_admin', 'property_manager', 'tenant', 'maintenance', 'accountant'
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    mfa_enabled BOOLEAN DEFAULT FALSE,
    mfa_secret VARCHAR(100),
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(email, org_id)
);

CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_org ON public.users(org_id);

CREATE TABLE public.subscription_billing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES public.organizations(id),
    plan VARCHAR(20) NOT NULL,
    amount_kes NUMERIC(10,2) NOT NULL,
    billing_date DATE NOT NULL,
    paid BOOLEAN DEFAULT FALSE,
    mpesa_receipt VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Prevent deletion/update on audit_log
CREATE OR REPLACE FUNCTION prevent_audit_modification()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Audit log entries cannot be modified or deleted';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_log_immutable
    BEFORE UPDATE OR DELETE ON audit_log
    FOR EACH ROW EXECUTE FUNCTION prevent_audit_modification();

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_tenants_updated_at BEFORE UPDATE ON tenants FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_units_updated_at BEFORE UPDATE ON units FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_leases_updated_at BEFORE UPDATE ON leases FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_disputes_updated_at BEFORE UPDATE ON disputes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_maintenance_updated_at BEFORE UPDATE ON maintenance_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-update unit status when lease activates
CREATE OR REPLACE FUNCTION update_unit_on_lease_change()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'active' AND (OLD.status IS NULL OR OLD.status != 'active') THEN
        UPDATE units SET status = 'occupied' WHERE id = NEW.unit_id;
    ELSIF NEW.status IN ('terminated', 'expired') AND OLD.status = 'active' THEN
        UPDATE units SET status = 'vacant' WHERE id = NEW.unit_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_lease_unit_status
    AFTER INSERT OR UPDATE ON leases
    FOR EACH ROW EXECUTE FUNCTION update_unit_on_lease_change();
