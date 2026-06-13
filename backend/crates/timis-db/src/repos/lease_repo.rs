use sqlx::PgPool;
use uuid::Uuid;
use chrono::NaiveDate;

pub async fn find_expiring(pool: &PgPool, before_date: NaiveDate) -> Result<Vec<sqlx::postgres::PgRow>, sqlx::Error> {
    sqlx::query("SELECT * FROM leases WHERE status = 'active' AND end_date <= $1 ORDER BY end_date")
        .bind(before_date)
        .fetch_all(pool)
        .await
}
