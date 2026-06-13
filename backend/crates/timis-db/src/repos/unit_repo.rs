use sqlx::PgPool;
use uuid::Uuid;

pub async fn list_by_building(pool: &PgPool, building_id: Uuid) -> Result<Vec<sqlx::postgres::PgRow>, sqlx::Error> {
    sqlx::query("SELECT * FROM units WHERE building_id = $1 ORDER BY unit_number")
        .bind(building_id)
        .fetch_all(pool)
        .await
}

pub async fn list_vacant(pool: &PgPool) -> Result<Vec<sqlx::postgres::PgRow>, sqlx::Error> {
    sqlx::query("SELECT * FROM units WHERE status = 'vacant' ORDER BY rent_amount_kes")
        .fetch_all(pool)
        .await
}
