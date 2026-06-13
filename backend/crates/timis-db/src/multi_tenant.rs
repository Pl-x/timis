use sqlx::{PgPool, Row};
use tracing::info;

/// Sets the search_path for the current connection to the org's schema.
/// Called per-request via middleware after resolving org from subdomain/JWT.
pub async fn set_org_schema(pool: &PgPool, org_id: &str) -> Result<(), sqlx::Error> {
    let schema_name = format!("org_{}", org_id.replace('-', "_"));
    sqlx::query(&format!("SET search_path TO {}, public", schema_name))
        .execute(pool)
        .await?;
    Ok(())
}

/// Creates a new schema for an organization (called on org signup).
pub async fn create_org_schema(pool: &PgPool, org_id: &str) -> Result<(), sqlx::Error> {
    let schema_name = format!("org_{}", org_id.replace('-', "_"));
    info!("Creating schema: {}", schema_name);
    sqlx::query(&format!("CREATE SCHEMA IF NOT EXISTS {}", schema_name))
        .execute(pool)
        .await?;
    // Run migrations within the new schema (apply org-level tables)
    sqlx::query(&format!("SET search_path TO {}", schema_name))
        .execute(pool)
        .await?;
    Ok(())
}
