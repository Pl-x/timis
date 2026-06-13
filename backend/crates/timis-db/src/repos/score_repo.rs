use sqlx::PgPool;
use uuid::Uuid;

pub async fn get_score(pool: &PgPool, tenant_id: Uuid) -> Result<Option<(i32, String)>, sqlx::Error> {
    let row: Option<(i32, String)> = sqlx::query_as(
        "SELECT score, band FROM kiro_scores WHERE tenant_id = $1"
    )
    .bind(tenant_id)
    .fetch_optional(pool)
    .await?;
    Ok(row)
}
