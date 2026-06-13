use axum::{extract::{State, Multipart}, http::StatusCode, Json};
use serde::Serialize;
use uuid::Uuid;
use crate::state::AppState;

#[derive(Serialize)]
pub struct UploadResponse {
    pub id: String,
    pub file_url: String,
    pub file_name: String,
    pub doc_type: String,
}

pub async fn upload_document(
    State(state): State<AppState>,
    mut multipart: Multipart,
) -> Result<Json<UploadResponse>, (StatusCode, Json<serde_json::Value>)> {
    let mut file_bytes: Option<Vec<u8>> = None;
    let mut file_name = String::new();
    let mut doc_type = String::new();
    let mut tenant_id = String::new();
    let mut content_type = "application/octet-stream".to_string();

    while let Some(field) = multipart.next_field().await.map_err(|_| (StatusCode::BAD_REQUEST, Json(serde_json::json!({"message": "Invalid multipart"}))))? {
        let name = field.name().unwrap_or("").to_string();
        match name.as_str() {
            "file" => {
                file_name = field.file_name().unwrap_or("document").to_string();
                content_type = field.content_type().unwrap_or("application/octet-stream").to_string();
                file_bytes = Some(field.bytes().await.map_err(|_| (StatusCode::BAD_REQUEST, Json(serde_json::json!({"message": "Failed to read file"}))))?.to_vec());
            }
            "doc_type" => { doc_type = field.text().await.unwrap_or_default(); }
            "tenant_id" => { tenant_id = field.text().await.unwrap_or_default(); }
            _ => {}
        }
    }

    let bytes = file_bytes.ok_or_else(|| (StatusCode::BAD_REQUEST, Json(serde_json::json!({"message": "No file provided"}))))?;

    if tenant_id.is_empty() || doc_type.is_empty() {
        return Err((StatusCode::BAD_REQUEST, Json(serde_json::json!({"message": "tenant_id and doc_type required"}))));
    }

    // Upload to Supabase Storage
    let supabase_url = std::env::var("SUPABASE_URL").unwrap_or_default();
    let supabase_key = std::env::var("SUPABASE_SERVICE_KEY").unwrap_or_default();
    let bucket = std::env::var("SUPABASE_BUCKET").unwrap_or_else(|_| "timis".into());
    let path = format!("{}/{}-{}", tenant_id, doc_type, file_name);

    let client = reqwest::Client::new();
    let upload_url = format!("{}/storage/v1/object/{}/{}", supabase_url, bucket, path);

    let res = client.post(&upload_url)
        .header("Authorization", format!("Bearer {}", supabase_key))
        .header("Content-Type", &content_type)
        .header("x-upsert", "true")
        .body(bytes)
        .send().await
        .map_err(|e| (StatusCode::BAD_GATEWAY, Json(serde_json::json!({"message": format!("Upload failed: {}", e)}))))?;

    if !res.status().is_success() {
        let err_text = res.text().await.unwrap_or_default();
        return Err((StatusCode::BAD_GATEWAY, Json(serde_json::json!({"message": format!("Supabase storage error: {}", err_text)}))));
    }

    let file_url = format!("{}/storage/v1/object/public/{}/{}", supabase_url, bucket, path);

    // Save metadata to PostgreSQL
    let doc_id = Uuid::new_v4();
    let tid: Uuid = tenant_id.parse().map_err(|_| (StatusCode::BAD_REQUEST, Json(serde_json::json!({"message": "Invalid tenant_id"}))))?;

    sqlx::query("INSERT INTO tenant_documents (id, tenant_id, doc_type, file_url, file_name, mime_type) VALUES ($1, $2, $3, $4, $5, $6)")
        .bind(doc_id).bind(tid).bind(&doc_type).bind(&file_url).bind(&file_name).bind(&content_type)
        .execute(&state.db).await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"message": format!("DB error: {}", e)}))))?;

    Ok(Json(UploadResponse { id: doc_id.to_string(), file_url, file_name, doc_type }))
}
