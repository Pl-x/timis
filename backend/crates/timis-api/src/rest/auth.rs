use axum::{extract::State, http::StatusCode, Json};
use serde::{Deserialize, Serialize};
use sqlx::Row;
use uuid::Uuid;
use crate::state::AppState;

#[derive(Deserialize)]
pub struct RegisterRequest {
    pub email: String,
    pub password: String,
    pub first_name: String,
    pub last_name: String,
    pub phone: String,
    pub org_name: String,
    pub plan: Option<String>,
}

#[derive(Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

#[derive(Serialize)]
pub struct AuthResponse {
    pub access_token: String,
    pub user: UserInfo,
}

#[derive(Serialize)]
pub struct UserInfo {
    pub id: String,
    pub email: String,
    pub first_name: String,
    pub last_name: String,
    pub role: String,
    pub org_id: String,
    pub org_name: String,
    pub plan: String,
}

fn max_units_for(plan: &str) -> i32 {
    match plan { "starter" => 30, "pro" => 100, "enterprise" => 100000, _ => 5 }
}

pub async fn register(
    State(state): State<AppState>,
    Json(body): Json<RegisterRequest>,
) -> Result<Json<AuthResponse>, (StatusCode, Json<serde_json::Value>)> {
    let org_id = Uuid::new_v4();
    let slug = format!("{}-{}", body.org_name.to_lowercase().replace(' ', "-"), &org_id.to_string()[..8]);
    let schema_name = format!("org_{}", org_id.to_string().replace('-', "_"));
    let plan = body.plan.clone().unwrap_or_else(|| "free".into());
    let max_units = max_units_for(&plan);

    sqlx::query("INSERT INTO public.organizations (id, name, slug, owner_user_id, schema_name, plan, max_units) VALUES ($1, $2, $3, $4, $5, $6, $7)")
        .bind(org_id).bind(&body.org_name).bind(&slug).bind(org_id).bind(&schema_name).bind(&plan).bind(max_units)
        .execute(&state.db).await
        .map_err(|e| (StatusCode::CONFLICT, Json(serde_json::json!({"message": format!("Org creation failed: {}", e)}))))?;

    let password_hash = timis_auth::password::hash_password(&body.password)
        .map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"message": "Password hash failed"}))))?;

    let user_id = Uuid::new_v4();
    sqlx::query("INSERT INTO public.users (id, org_id, email, phone, password_hash, role, first_name, last_name) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)")
        .bind(user_id).bind(org_id).bind(&body.email).bind(&body.phone)
        .bind(&password_hash).bind("landlord_admin").bind(&body.first_name).bind(&body.last_name)
        .execute(&state.db).await
        .map_err(|e| (StatusCode::CONFLICT, Json(serde_json::json!({"message": format!("User creation failed: {}", e)}))))?;

    sqlx::query("UPDATE public.organizations SET owner_user_id = $1 WHERE id = $2")
        .bind(user_id).bind(org_id).execute(&state.db).await.ok();

    let secret = std::env::var("JWT_SECRET").unwrap_or_else(|_| "dev-secret".into());
    let token = timis_auth::jwt::create_token(user_id, org_id, "landlord_admin", &secret, 24)
        .map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"message": "Token generation failed"}))))?;

    Ok(Json(AuthResponse {
        access_token: token,
        user: UserInfo {
            id: user_id.to_string(),
            email: body.email,
            first_name: body.first_name,
            last_name: body.last_name,
            role: "landlord_admin".into(),
            org_id: org_id.to_string(),
            org_name: body.org_name,
            plan,
        },
    }))
}

pub async fn login(
    State(state): State<AppState>,
    Json(body): Json<LoginRequest>,
) -> Result<Json<AuthResponse>, (StatusCode, Json<serde_json::Value>)> {
    let row = sqlx::query("SELECT u.id, u.org_id, u.email, u.password_hash, u.role, u.first_name, u.last_name, o.name as org_name, o.plan FROM public.users u JOIN public.organizations o ON o.id = u.org_id WHERE u.email = $1")
        .bind(&body.email)
        .fetch_optional(&state.db).await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"message": format!("Database error: {}", e)}))))?
        .ok_or_else(|| (StatusCode::UNAUTHORIZED, Json(serde_json::json!({"message": "Invalid email or password"}))))?;

    let hash: String = row.get("password_hash");
    let valid = timis_auth::password::verify_password(&body.password, &hash).unwrap_or(false);

    if !valid {
        return Err((StatusCode::UNAUTHORIZED, Json(serde_json::json!({"message": "Invalid email or password"}))));
    }

    let user_id: Uuid = row.get("id");
    let org_id: Uuid = row.get("org_id");
    let role: String = row.get("role");
    let first_name: String = row.get("first_name");
    let last_name: String = row.get("last_name");
    let org_name: String = row.get("org_name");
    let plan: String = row.get("plan");

    let secret = std::env::var("JWT_SECRET").unwrap_or_else(|_| "dev-secret".into());
    let token = timis_auth::jwt::create_token(user_id, org_id, &role, &secret, 24)
        .map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"message": "Token generation failed"}))))?;

    Ok(Json(AuthResponse {
        access_token: token,
        user: UserInfo {
            id: user_id.to_string(),
            email: body.email,
            first_name,
            last_name,
            role,
            org_id: org_id.to_string(),
            org_name,
            plan,
        },
    }))
}
