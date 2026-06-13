use sqlx::PgPool;
use uuid::Uuid;

pub async fn record_payment(pool: &PgPool, tenant_id: Uuid, invoice_id: Option<Uuid>, amount: f64, method: &str, mpesa_receipt: Option<&str>) -> Result<Uuid, sqlx::Error> {
    let row: (Uuid,) = sqlx::query_as(
        "INSERT INTO payments (tenant_id, invoice_id, amount_kes, method, status, mpesa_receipt_number, paid_at) VALUES ($1, $2, $3, $4::payment_method, 'confirmed', $5, NOW()) RETURNING id"
    )
    .bind(tenant_id).bind(invoice_id).bind(amount).bind(method).bind(mpesa_receipt)
    .fetch_one(pool)
    .await?;
    Ok(row.0)
}
