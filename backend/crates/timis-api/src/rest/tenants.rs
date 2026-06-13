use axum::{extract::State, http::StatusCode, Json};
use serde::{Deserialize, Serialize};
use sqlx::Row;
use uuid::Uuid;
use crate::state::AppState;

#[derive(Deserialize)]
pub struct CreateTenantRequest {
    pub first_name: String,
    pub last_name: String,
    pub phone: String,
    pub id_type: Option<String>,
    pub id_number: String,
    pub email: Option<String>,
}

#[derive(Serialize)]
pub struct TenantResponse {
    pub id: String,
    pub first_name: String,
    pub last_name: String,
    pub phone: String,
}

#[derive(Serialize)]
pub struct TenantListItem {
    pub id: String,
    pub first_name: String,
    pub last_name: String,
    pub phone: String,
    pub status: String,
    pub email: Option<String>,
}

pub async fn create_tenant(
    State(state): State<AppState>,
    Json(body): Json<CreateTenantRequest>,
) -> Result<(StatusCode, Json<TenantResponse>), (StatusCode, Json<serde_json::Value>)> {
    let id = Uuid::new_v4();
    let id_type = body.id_type.unwrap_or_else(|| "national_id".into());

    sqlx::query("INSERT INTO tenants (id, first_name, last_name, phone, id_type, id_number, email) VALUES ($1, $2, $3, $4, $5::id_type, $6, $7)")
        .bind(id).bind(&body.first_name).bind(&body.last_name).bind(&body.phone)
        .bind(&id_type).bind(&body.id_number).bind(&body.email)
        .execute(&state.db).await
        .map_err(|e| (StatusCode::CONFLICT, Json(serde_json::json!({"message": format!("Failed: {}", e)}))))?;

    Ok((StatusCode::CREATED, Json(TenantResponse {
        id: id.to_string(),
        first_name: body.first_name,
        last_name: body.last_name,
        phone: body.phone,
    })))
}

pub async fn list_tenants(
    State(state): State<AppState>,
) -> Result<Json<Vec<TenantListItem>>, (StatusCode, Json<serde_json::Value>)> {
    let rows = sqlx::query("SELECT id, first_name, last_name, phone, status::text as status, email FROM tenants ORDER BY created_at DESC")
        .fetch_all(&state.db).await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"message": format!("{}", e)}))))?;

    let tenants: Vec<TenantListItem> = rows.iter().map(|r| TenantListItem {
        id: r.get::<Uuid, _>("id").to_string(),
        first_name: r.get("first_name"),
        last_name: r.get("last_name"),
        phone: r.get("phone"),
        status: r.get::<Option<String>, _>("status").unwrap_or_default(),
        email: r.try_get("email").ok(),
    }).collect();

    Ok(Json(tenants))
}
