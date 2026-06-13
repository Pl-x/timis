use sqlx::PgPool;
use uuid::Uuid;

pub async fn list_by_unit(pool: &PgPool, unit_id: Uuid) -> Result<Vec<sqlx::postgres::PgRow>, sqlx::Error> {
    sqlx::query("SELECT * FROM maintenance_requests WHERE unit_id = $1 ORDER BY created_at DESC")
        .bind(unit_id)
        .fetch_all(pool)
        .await
}
