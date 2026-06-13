use sqlx::PgPool;
use tracing::info;

/// Runs on startup — creates ALL tables across all modules if they don't exist.
pub async fn run_migrations(pool: &PgPool) {
    info!("Running database migrations...");

    // Extensions
    sqlx::raw_sql(r#"
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    "#).execute(pool).await.expect("Extensions failed");

    // Public schema (platform-level)
    sqlx::raw_sql(r#"
        CREATE TABLE IF NOT EXISTS public.organizations (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name VARCHAR(200) NOT NULL,
            slug VARCHAR(100) NOT NULL UNIQUE,
            owner_user_id UUID NOT NULL,
            plan VARCHAR(20) NOT NULL DEFAULT 'free',
            max_units INT NOT NULL DEFAULT 5,
            schema_name VARCHAR(100) NOT NULL UNIQUE,
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS public.users (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            org_id UUID NOT NULL REFERENCES public.organizations(id),
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(20),
            password_hash VARCHAR(255) NOT NULL,
            role VARCHAR(50) NOT NULL,
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            is_active BOOLEAN DEFAULT TRUE,
            mfa_enabled BOOLEAN DEFAULT FALSE,
            mfa_secret VARCHAR(100),
            last_login_at TIMESTAMPTZ,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
        CREATE INDEX IF NOT EXISTS idx_users_org ON public.users(org_id);

        CREATE TABLE IF NOT EXISTS public.subscription_billing (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            org_id UUID NOT NULL REFERENCES public.organizations(id),
            plan VARCHAR(20) NOT NULL,
            amount_kes NUMERIC(10,2) NOT NULL,
            billing_date DATE NOT NULL,
            paid BOOLEAN DEFAULT FALSE,
            mpesa_receipt VARCHAR(50),
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
    "#).execute(pool).await.expect("Public schema migration failed");

    // Enum types (use DO block to avoid errors if they exist)
    sqlx::raw_sql(r#"
        DO $$ BEGIN CREATE TYPE tenant_status AS ENUM ('applicant','active','vacated','blacklisted'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
        DO $$ BEGIN CREATE TYPE vetting_status AS ENUM ('pending','in_progress','approved','rejected'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
        DO $$ BEGIN CREATE TYPE id_type AS ENUM ('national_id','passport','alien_id','military_id'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
        DO $$ BEGIN CREATE TYPE unit_type AS ENUM ('bedsitter','one_bed','two_bed','three_bed','maisonette','shop','office','stall','warehouse','mixed'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
        DO $$ BEGIN CREATE TYPE unit_status AS ENUM ('vacant','occupied','maintenance','reserved'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
        DO $$ BEGIN CREATE TYPE lease_status AS ENUM ('draft','active','renewal','expired','terminated'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
        DO $$ BEGIN CREATE TYPE invoice_status AS ENUM ('draft','sent','paid','partial','overdue','cancelled'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
        DO $$ BEGIN CREATE TYPE payment_method AS ENUM ('mpesa','bank_transfer','cash','cheque','card'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
        DO $$ BEGIN CREATE TYPE payment_status AS ENUM ('pending','confirmed','failed','reversed'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
        DO $$ BEGIN CREATE TYPE charge_type AS ENUM ('rent','deposit','water','electricity','service_charge','penalty','other'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
        DO $$ BEGIN CREATE TYPE dispute_category AS ENUM ('deposit','maintenance','rent_increase','eviction','utilities','noise_conduct','other'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
        DO $$ BEGIN CREATE TYPE dispute_status AS ENUM ('submitted','acknowledged','under_review','resolved','escalated','closed'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
        DO $$ BEGIN CREATE TYPE maintenance_status AS ENUM ('submitted','assigned','in_progress','completed','verified','closed'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
        DO $$ BEGIN CREATE TYPE urgency_level AS ENUM ('low','medium','high','emergency'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
        DO $$ BEGIN CREATE TYPE message_channel AS ENUM ('in_app','sms','email','whatsapp'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    "#).execute(pool).await.expect("Enum types migration failed");

    // Module 1: Tenants
    sqlx::raw_sql(r#"
        CREATE TABLE IF NOT EXISTS tenants (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            email VARCHAR(255),
            phone VARCHAR(20) NOT NULL UNIQUE,
            alt_phone VARCHAR(20),
            id_type id_type NOT NULL DEFAULT 'national_id',
            id_number VARCHAR(50) NOT NULL UNIQUE,
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
            id_document_url TEXT,
            notes TEXT,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS idx_tenants_phone ON tenants(phone);
        CREATE INDEX IF NOT EXISTS idx_tenants_status ON tenants(status);

        CREATE TABLE IF NOT EXISTS tenant_references (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
            referee_name VARCHAR(200) NOT NULL,
            referee_phone VARCHAR(20) NOT NULL,
            referee_email VARCHAR(255),
            relationship VARCHAR(50),
            status vetting_status NOT NULL DEFAULT 'pending',
            response_notes TEXT,
            contacted_at TIMESTAMPTZ,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS tenant_documents (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
            doc_type VARCHAR(50) NOT NULL,
            file_url TEXT NOT NULL,
            file_name VARCHAR(255),
            mime_type VARCHAR(100),
            uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
    "#).execute(pool).await.expect("Tenants migration failed");

    // Module 2: Properties, Buildings, Units, Leases
    sqlx::raw_sql(r#"
        CREATE TABLE IF NOT EXISTS properties (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name VARCHAR(200) NOT NULL,
            address TEXT NOT NULL,
            city VARCHAR(100) NOT NULL,
            county VARCHAR(100) NOT NULL,
            latitude NUMERIC(10,7),
            longitude NUMERIC(10,7),
            property_type VARCHAR(50) NOT NULL,
            total_units INT NOT NULL DEFAULT 0,
            year_built INT,
            lr_number VARCHAR(100),
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS buildings (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
            name VARCHAR(200) NOT NULL,
            floors INT NOT NULL DEFAULT 1,
            floor_plan_url TEXT,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS units (
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
            amenities TEXT[],
            description TEXT,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            UNIQUE(building_id, unit_number)
        );
        CREATE INDEX IF NOT EXISTS idx_units_status ON units(status);

        CREATE TABLE IF NOT EXISTS leases (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            tenant_id UUID NOT NULL REFERENCES tenants(id),
            unit_id UUID NOT NULL REFERENCES units(id),
            status lease_status NOT NULL DEFAULT 'draft',
            start_date DATE NOT NULL,
            end_date DATE NOT NULL,
            rent_amount_kes NUMERIC(12,2) NOT NULL,
            deposit_amount_kes NUMERIC(12,2) NOT NULL,
            deposit_paid BOOLEAN DEFAULT FALSE,
            billing_day INT NOT NULL DEFAULT 1,
            rent_review_date DATE,
            notice_period_days INT NOT NULL DEFAULT 30,
            agreement_url TEXT,
            signed_at TIMESTAMPTZ,
            terminated_at TIMESTAMPTZ,
            termination_reason TEXT,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS idx_leases_tenant ON leases(tenant_id);
        CREATE INDEX IF NOT EXISTS idx_leases_unit ON leases(unit_id);
        CREATE INDEX IF NOT EXISTS idx_leases_status ON leases(status);
    "#).execute(pool).await.expect("Properties/Leases migration failed");

    // Module 3: Financial Engine
    sqlx::raw_sql(r#"
        CREATE TABLE IF NOT EXISTS invoices (
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
            etims_invoice_number VARCHAR(100),
            sent_at TIMESTAMPTZ,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS idx_invoices_tenant ON invoices(tenant_id);
        CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);

        CREATE TABLE IF NOT EXISTS invoice_lines (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
            charge_type charge_type NOT NULL,
            description VARCHAR(255) NOT NULL,
            amount_kes NUMERIC(12,2) NOT NULL,
            quantity NUMERIC(8,2) DEFAULT 1
        );

        CREATE TABLE IF NOT EXISTS payments (
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
            metadata JSONB,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS idx_payments_tenant ON payments(tenant_id);
        CREATE INDEX IF NOT EXISTS idx_payments_mpesa ON payments(mpesa_receipt_number);

        CREATE TABLE IF NOT EXISTS landlord_payouts (
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
    "#).execute(pool).await.expect("Financial migration failed");

    // Module 4: Timis Score
    sqlx::raw_sql(r#"
        CREATE TABLE IF NOT EXISTS kiro_scores (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            tenant_id UUID NOT NULL REFERENCES tenants(id) UNIQUE,
            score INT NOT NULL CHECK(score BETWEEN 0 AND 850),
            band VARCHAR(20) NOT NULL,
            payment_punctuality_score NUMERIC(5,2),
            payment_completeness_score NUMERIC(5,2),
            tenancy_duration_score NUMERIC(5,2),
            dispute_history_score NUMERIC(5,2),
            maintenance_behavior_score NUMERIC(5,2),
            vacate_compliance_score NUMERIC(5,2),
            reference_quality_score NUMERIC(5,2),
            calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS kiro_score_history (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            tenant_id UUID NOT NULL REFERENCES tenants(id),
            score INT NOT NULL,
            change_amount INT NOT NULL,
            change_reason TEXT NOT NULL,
            calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS idx_score_history_tenant ON kiro_score_history(tenant_id, calculated_at DESC);

        CREATE TABLE IF NOT EXISTS kiro_score_shares (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            tenant_id UUID NOT NULL REFERENCES tenants(id),
            share_token VARCHAR(64) NOT NULL UNIQUE,
            expires_at TIMESTAMPTZ NOT NULL,
            accessed_count INT DEFAULT 0,
            max_access INT DEFAULT 1,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS landlord_scores (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            property_id UUID NOT NULL REFERENCES properties(id) UNIQUE,
            score INT NOT NULL CHECK(score BETWEEN 0 AND 850),
            maintenance_response_score NUMERIC(5,2),
            dispute_outcome_score NUMERIC(5,2),
            eviction_compliance_score NUMERIC(5,2),
            tenant_retention_score NUMERIC(5,2),
            calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
    "#).execute(pool).await.expect("Timis Score migration failed");

    // Module 5: Disputes
    sqlx::raw_sql(r#"
        CREATE TABLE IF NOT EXISTS disputes (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            dispute_number VARCHAR(50) NOT NULL UNIQUE,
            tenant_id UUID NOT NULL REFERENCES tenants(id),
            unit_id UUID NOT NULL REFERENCES units(id),
            lease_id UUID REFERENCES leases(id),
            category dispute_category NOT NULL,
            subject VARCHAR(300) NOT NULL,
            description TEXT NOT NULL,
            status dispute_status NOT NULL DEFAULT 'submitted',
            filed_by VARCHAR(20) NOT NULL,
            evidence_urls TEXT[],
            resolution_notes TEXT,
            resolution_outcome VARCHAR(50),
            escalated_to VARCHAR(100),
            resolved_at TIMESTAMPTZ,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS idx_disputes_tenant ON disputes(tenant_id);
        CREATE INDEX IF NOT EXISTS idx_disputes_status ON disputes(status);

        CREATE TABLE IF NOT EXISTS dispute_timeline (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            dispute_id UUID NOT NULL REFERENCES disputes(id) ON DELETE CASCADE,
            action VARCHAR(100) NOT NULL,
            actor_id UUID,
            actor_role VARCHAR(50),
            notes TEXT,
            attachment_urls TEXT[],
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS dispute_documents (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            dispute_id UUID NOT NULL REFERENCES disputes(id) ON DELETE CASCADE,
            doc_type VARCHAR(50) NOT NULL,
            content TEXT NOT NULL,
            generated_by VARCHAR(20) DEFAULT 'ai',
            file_url TEXT,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
    "#).execute(pool).await.expect("Disputes migration failed");

    // Module 6: Maintenance
    sqlx::raw_sql(r#"
        CREATE TABLE IF NOT EXISTS vendors (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name VARCHAR(200) NOT NULL,
            phone VARCHAR(20) NOT NULL,
            email VARCHAR(255),
            skills TEXT[] NOT NULL,
            id_number VARCHAR(50),
            location VARCHAR(200),
            avg_rating NUMERIC(3,2) DEFAULT 0,
            total_jobs INT DEFAULT 0,
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS maintenance_requests (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            request_number VARCHAR(50) NOT NULL UNIQUE,
            tenant_id UUID NOT NULL REFERENCES tenants(id),
            unit_id UUID NOT NULL REFERENCES units(id),
            category VARCHAR(50) NOT NULL,
            description TEXT NOT NULL,
            urgency urgency_level NOT NULL DEFAULT 'medium',
            status maintenance_status NOT NULL DEFAULT 'submitted',
            media_urls TEXT[],
            assigned_to UUID REFERENCES vendors(id),
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
        CREATE INDEX IF NOT EXISTS idx_maintenance_tenant ON maintenance_requests(tenant_id);
        CREATE INDEX IF NOT EXISTS idx_maintenance_status ON maintenance_requests(status);
    "#).execute(pool).await.expect("Maintenance migration failed");

    // Module 7: Communications
    sqlx::raw_sql(r#"
        CREATE TABLE IF NOT EXISTS conversations (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            subject VARCHAR(300),
            participants UUID[] NOT NULL,
            related_type VARCHAR(50),
            related_id UUID,
            is_broadcast BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS messages (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            conversation_id UUID NOT NULL REFERENCES conversations(id),
            sender_id UUID NOT NULL,
            content TEXT NOT NULL,
            channel message_channel NOT NULL DEFAULT 'in_app',
            attachment_urls TEXT[],
            read_by UUID[] DEFAULT '{}',
            is_system BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id, created_at);

        CREATE TABLE IF NOT EXISTS notifications (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID NOT NULL,
            title VARCHAR(200) NOT NULL,
            body TEXT NOT NULL,
            category VARCHAR(50) NOT NULL,
            related_type VARCHAR(50),
            related_id UUID,
            is_read BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read, created_at DESC);
    "#).execute(pool).await.expect("Communications migration failed");

    // Module 8: AI interactions
    sqlx::raw_sql(r#"
        CREATE TABLE IF NOT EXISTS ai_interactions (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID NOT NULL,
            feature VARCHAR(50) NOT NULL,
            prompt_summary TEXT,
            response_summary TEXT,
            tokens_used INT,
            model_version VARCHAR(50),
            feedback_rating INT CHECK(feedback_rating BETWEEN 1 AND 5),
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS idx_ai_interactions_user ON ai_interactions(user_id, created_at DESC);
    "#).execute(pool).await.expect("AI migration failed");

    // Module 10: Compliance & Audit
    sqlx::raw_sql(r#"
        CREATE TABLE IF NOT EXISTS audit_log (
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
        );
        CREATE INDEX IF NOT EXISTS idx_audit_log_user ON audit_log(user_id, created_at DESC);

        CREATE TABLE IF NOT EXISTS consent_records (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            tenant_id UUID NOT NULL REFERENCES tenants(id),
            consent_type VARCHAR(50) NOT NULL,
            granted BOOLEAN NOT NULL,
            granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            revoked_at TIMESTAMPTZ,
            ip_address INET
        );

        CREATE TABLE IF NOT EXISTS data_requests (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            tenant_id UUID NOT NULL REFERENCES tenants(id),
            request_type VARCHAR(50) NOT NULL,
            status VARCHAR(20) NOT NULL DEFAULT 'pending',
            responded_at TIMESTAMPTZ,
            response_notes TEXT,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
    "#).execute(pool).await.expect("Compliance migration failed");

    info!("All database migrations complete — all 10 modules ready.");
}
