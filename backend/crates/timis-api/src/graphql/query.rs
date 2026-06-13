use async_graphql::*;
use sqlx::{PgPool, Row};
use uuid::Uuid;

pub struct QueryRoot;

#[Object]
impl QueryRoot {
    async fn tenant(&self, ctx: &Context<'_>, id: ID) -> Result<Option<serde_json::Value>> {
        let pool = ctx.data::<PgPool>()?;
        let uid: Uuid = id.parse()?;
        let row = sqlx::query("SELECT id, first_name, last_name, phone, status::text as status FROM tenants WHERE id = $1")
            .bind(uid)
            .fetch_optional(pool).await?;
        Ok(row.map(|r| serde_json::json!({
            "id": r.get::<Uuid, _>("id"),
            "first_name": r.get::<String, _>("first_name"),
            "last_name": r.get::<String, _>("last_name"),
            "phone": r.get::<String, _>("phone"),
            "status": r.get::<Option<String>, _>("status"),
        })))
    }

    async fn tenants(&self, ctx: &Context<'_>, limit: Option<i64>, offset: Option<i64>) -> Result<Vec<serde_json::Value>> {
        let pool = ctx.data::<PgPool>()?;
        let rows = sqlx::query("SELECT id, first_name, last_name, phone FROM tenants ORDER BY created_at DESC LIMIT $1 OFFSET $2")
            .bind(limit.unwrap_or(20)).bind(offset.unwrap_or(0))
            .fetch_all(pool).await?;
        Ok(rows.iter().map(|r| serde_json::json!({
            "id": r.get::<Uuid, _>("id"),
            "first_name": r.get::<String, _>("first_name"),
            "last_name": r.get::<String, _>("last_name"),
            "phone": r.get::<String, _>("phone"),
        })).collect())
    }

    async fn units(&self, ctx: &Context<'_>, building_id: ID) -> Result<Vec<serde_json::Value>> {
        let pool = ctx.data::<PgPool>()?;
        let bid: Uuid = building_id.parse()?;
        let rows = sqlx::query("SELECT id, unit_number, unit_type::text as unit_type, rent_amount_kes, status::text as status FROM units WHERE building_id = $1")
            .bind(bid)
            .fetch_all(pool).await?;
        Ok(rows.iter().map(|r| serde_json::json!({
            "id": r.get::<Uuid, _>("id"),
            "unit_number": r.get::<String, _>("unit_number"),
            "unit_type": r.get::<Option<String>, _>("unit_type"),
            "rent_amount_kes": r.get::<f64, _>("rent_amount_kes"),
            "status": r.get::<Option<String>, _>("status"),
        })).collect())
    }

    async fn kiro_score(&self, ctx: &Context<'_>, tenant_id: ID) -> Result<Option<serde_json::Value>> {
        let pool = ctx.data::<PgPool>()?;
        let tid: Uuid = tenant_id.parse()?;
        let row = sqlx::query("SELECT score, band, calculated_at FROM kiro_scores WHERE tenant_id = $1")
            .bind(tid)
            .fetch_optional(pool).await?;
        Ok(row.map(|r| serde_json::json!({
            "score": r.get::<i32, _>("score"),
            "band": r.get::<String, _>("band"),
            "calculated_at": r.get::<chrono::DateTime<chrono::Utc>, _>("calculated_at"),
        })))
    }
}
