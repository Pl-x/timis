use axum::{extract::{State, Path}, http::StatusCode, Json};
use serde::{Deserialize, Serialize};
use sqlx::Row;
use uuid::Uuid;
use crate::state::AppState;

#[derive(Deserialize)]
pub struct UpdateOrgRequest {
    pub name: String,
}

#[derive(Serialize)]
pub struct OrgResponse {
    pub id: String,
    pub name: String,
    pub plan: String,
    pub slug: String,
}

pub async fn get_org(
    State(state): State<AppState>,
    Path(id): Path<String>,
) -> Result<Json<OrgResponse>, (StatusCode, Json<serde_json::Value>)> {
    let oid: Uuid = id.parse().map_err(|_| (StatusCode::BAD_REQUEST, Json(serde_json::json!({"message": "Invalid org id"}))))?;
    let row = sqlx::query("SELECT id, name, plan, slug FROM public.organizations WHERE id = $1")
        .bind(oid)
        .fetch_optional(&state.db).await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"message": format!("{}", e)}))))?
        .ok_or_else(|| (StatusCode::NOT_FOUND, Json(serde_json::json!({"message": "Org not found"}))))?;

    Ok(Json(OrgResponse {
        id: row.get::<Uuid, _>("id").to_string(),
        name: row.get("name"),
        plan: row.get("plan"),
        slug: row.get("slug"),
    }))
}

pub async fn update_org(
    State(state): State<AppState>,
    Path(id): Path<String>,
    Json(body): Json<UpdateOrgRequest>,
) -> Result<Json<serde_json::Value>, (StatusCode, Json<serde_json::Value>)> {
    let oid: Uuid = id.parse().map_err(|_| (StatusCode::BAD_REQUEST, Json(serde_json::json!({"message": "Invalid org id"}))))?;
    sqlx::query("UPDATE public.organizations SET name = $1 WHERE id = $2")
        .bind(&body.name).bind(oid)
        .execute(&state.db).await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"message": format!("{}", e)}))))?;
    Ok(Json(serde_json::json!({"message": "Organization updated", "name": body.name})))
}

#[derive(Deserialize)]
pub struct UpgradeRequest {
    pub plan: String,
}

pub async fn upgrade_org(
    State(state): State<AppState>,
    Path(id): Path<String>,
    Json(body): Json<UpgradeRequest>,
) -> Result<Json<serde_json::Value>, (StatusCode, Json<serde_json::Value>)> {
    let oid: Uuid = id.parse().map_err(|_| (StatusCode::BAD_REQUEST, Json(serde_json::json!({"message": "Invalid org id"}))))?;
    let max_units = match body.plan.as_str() {
        "starter" => 30, "pro" => 100, "enterprise" => 100000, _ => 5,
    };
    sqlx::query("UPDATE public.organizations SET plan = $1, max_units = $2 WHERE id = $3")
        .bind(&body.plan).bind(max_units).bind(oid)
        .execute(&state.db).await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"message": format!("{}", e)}))))?;
    Ok(Json(serde_json::json!({"message": format!("Upgraded to {}", body.plan), "plan": body.plan})))
}

pub async fn delete_org(
    State(state): State<AppState>,
    Path(id): Path<String>,
) -> Result<Json<serde_json::Value>, (StatusCode, Json<serde_json::Value>)> {
    let oid: Uuid = id.parse().map_err(|_| (StatusCode::BAD_REQUEST, Json(serde_json::json!({"message": "Invalid org id"}))))?;
    // Delete users first (FK), then org
    sqlx::query("DELETE FROM public.users WHERE org_id = $1").bind(oid).execute(&state.db).await.ok();
    sqlx::query("DELETE FROM public.organizations WHERE id = $1")
        .bind(oid)
        .execute(&state.db).await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"message": format!("{}", e)}))))?;
    Ok(Json(serde_json::json!({"message": "Organization deleted"})))
}
