use sqlx::PgPool;
use uuid::Uuid;

pub async fn create(pool: &PgPool, first_name: &str, last_name: &str, phone: &str, id_number: &str, email: Option<&str>) -> Result<Uuid, sqlx::Error> {
    let row: (Uuid,) = sqlx::query_as(
        "INSERT INTO tenants (first_name, last_name, phone, id_type, id_number, email) VALUES ($1, $2, $3, 'national_id', $4, $5) RETURNING id"
    )
    .bind(first_name).bind(last_name).bind(phone).bind(id_number).bind(email)
    .fetch_one(pool)
    .await?;
    Ok(row.0)
}

pub async fn find_by_id(pool: &PgPool, id: Uuid) -> Result<Option<sqlx::postgres::PgRow>, sqlx::Error> {
    sqlx::query("SELECT * FROM tenants WHERE id = $1")
        .bind(id)
        .fetch_optional(pool)
        .await
}

pub async fn list(pool: &PgPool, limit: i64, offset: i64) -> Result<Vec<sqlx::postgres::PgRow>, sqlx::Error> {
    sqlx::query("SELECT * FROM tenants ORDER BY created_at DESC LIMIT $1 OFFSET $2")
        .bind(limit).bind(offset)
        .fetch_all(pool)
        .await
}
