use sqlx::PgPool;
use uuid::Uuid;

pub async fn list_by_tenant(pool: &PgPool, tenant_id: Uuid) -> Result<Vec<sqlx::postgres::PgRow>, sqlx::Error> {
    sqlx::query("SELECT * FROM disputes WHERE tenant_id = $1 ORDER BY created_at DESC")
        .bind(tenant_id)
        .fetch_all(pool)
        .await
}
