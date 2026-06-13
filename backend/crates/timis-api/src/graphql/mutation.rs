use async_graphql::*;
use sqlx::{PgPool, Row};
use uuid::Uuid;

pub struct MutationRoot;

#[Object]
impl MutationRoot {
    async fn create_tenant(&self, ctx: &Context<'_>, input: CreateTenantInput) -> Result<ID> {
        let pool = ctx.data::<PgPool>()?;
        let row: (Uuid,) = sqlx::query_as(
            "INSERT INTO tenants (first_name, last_name, phone, id_type, id_number, email) VALUES ($1, $2, $3, 'national_id', $4, $5) RETURNING id"
        )
        .bind(&input.first_name).bind(&input.last_name).bind(&input.phone)
        .bind(&input.id_number).bind(&input.email)
        .fetch_one(pool).await?;
        Ok(ID(row.0.to_string()))
    }

    async fn create_payment(&self, ctx: &Context<'_>, input: RecordPaymentInput) -> Result<ID> {
        let pool = ctx.data::<PgPool>()?;
        let tenant_id: Uuid = input.tenant_id.parse()?;
        let invoice_id: Option<Uuid> = input.invoice_id.as_ref().map(|i| i.parse()).transpose()?;
        let row: (Uuid,) = sqlx::query_as(
            "INSERT INTO payments (tenant_id, invoice_id, amount_kes, method, status, mpesa_receipt_number, paid_at) VALUES ($1, $2, $3, $4::payment_method, 'confirmed', $5, NOW()) RETURNING id"
        )
        .bind(tenant_id).bind(invoice_id).bind(input.amount_kes)
        .bind(&input.method).bind(&input.mpesa_receipt)
        .fetch_one(pool).await?;
        Ok(ID(row.0.to_string()))
    }

    async fn submit_dispute(&self, ctx: &Context<'_>, input: SubmitDisputeInput) -> Result<ID> {
        let pool = ctx.data::<PgPool>()?;
        let tenant_id: Uuid = input.tenant_id.parse()?;
        let unit_id: Uuid = input.unit_id.parse()?;
        let num = format!("DSP-{}", chrono::Utc::now().timestamp_millis());
        let row: (Uuid,) = sqlx::query_as(
            "INSERT INTO disputes (dispute_number, tenant_id, unit_id, category, subject, description, filed_by) VALUES ($1, $2, $3, $4::dispute_category, $5, $6, $7) RETURNING id"
        )
        .bind(&num).bind(tenant_id).bind(unit_id)
        .bind(&input.category).bind(&input.subject).bind(&input.description).bind(&input.filed_by)
        .fetch_one(pool).await?;
        Ok(ID(row.0.to_string()))
    }
}

#[derive(InputObject)]
struct CreateTenantInput {
    first_name: String,
    last_name: String,
    phone: String,
    id_number: String,
    email: Option<String>,
}

#[derive(InputObject)]
struct RecordPaymentInput {
    tenant_id: String,
    invoice_id: Option<String>,
    amount_kes: f64,
    method: String,
    mpesa_receipt: Option<String>,
}

#[derive(InputObject)]
struct SubmitDisputeInput {
    tenant_id: String,
    unit_id: String,
    category: String,
    subject: String,
    description: String,
    filed_by: String,
}
