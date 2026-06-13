use axum::{extract::State, http::StatusCode, Json};
use serde::{Deserialize, Serialize};
use sqlx::Row;
use uuid::Uuid;
use crate::state::AppState;

#[derive(Deserialize)]
pub struct CreatePropertyRequest {
    pub name: String,
    pub address: String,
    pub city: String,
    pub county: String,
    pub property_type: String,
}

#[derive(Serialize)]
pub struct PropertyItem {
    pub id: String,
    pub name: String,
    pub address: String,
    pub city: String,
    pub county: String,
    pub total_units: i32,
}

pub async fn create_property(
    State(state): State<AppState>,
    Json(body): Json<CreatePropertyRequest>,
) -> Result<(StatusCode, Json<PropertyItem>), (StatusCode, Json<serde_json::Value>)> {
    let id = Uuid::new_v4();
    sqlx::query("INSERT INTO properties (id, name, address, city, county, property_type) VALUES ($1, $2, $3, $4, $5, $6)")
        .bind(id).bind(&body.name).bind(&body.address).bind(&body.city).bind(&body.county).bind(&body.property_type)
        .execute(&state.db).await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"message": format!("{}", e)}))))?;

    Ok((StatusCode::CREATED, Json(PropertyItem {
        id: id.to_string(),
        name: body.name,
        address: body.address,
        city: body.city,
        county: body.county,
        total_units: 0,
    })))
}

pub async fn list_properties(
    State(state): State<AppState>,
) -> Result<Json<Vec<PropertyItem>>, (StatusCode, Json<serde_json::Value>)> {
    let rows = sqlx::query("SELECT id, name, address, city, county, total_units FROM properties ORDER BY created_at DESC")
        .fetch_all(&state.db).await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"message": format!("{}", e)}))))?;

    let props: Vec<PropertyItem> = rows.iter().map(|r| PropertyItem {
        id: r.get::<Uuid, _>("id").to_string(),
        name: r.get("name"),
        address: r.get("address"),
        city: r.get("city"),
        county: r.get("county"),
        total_units: r.get("total_units"),
    }).collect();

    Ok(Json(props))
}
