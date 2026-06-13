use axum::{extract::State, http::StatusCode, Json};
use serde::{Deserialize, Serialize};
use crate::state::AppState;
use timis_ai::client::ClaudeClient;
use timis_ai::router::{AIRequest, AIResult};
use timis_core::config::ClaudeConfig;

#[derive(Deserialize)]
pub struct AIQueryBody {
    pub feature: String,
    pub query: String,
    pub context: Option<serde_json::Value>,
}

#[derive(Serialize)]
pub struct AIQueryResponse {
    pub content: String,
    pub feature: String,
    pub disclaimer: Option<String>,
}

pub async fn query(
    State(_state): State<AppState>,
    Json(body): Json<AIQueryBody>,
) -> Result<Json<AIQueryResponse>, (StatusCode, Json<serde_json::Value>)> {
    let config = ClaudeConfig {
        api_key: std::env::var("AI_API_KEY")
            .or_else(|_| std::env::var("CLAUDE_API_KEY"))
            .unwrap_or_default(),
        model: std::env::var("AI_MODEL")
            .or_else(|_| std::env::var("CLAUDE_MODEL"))
            .unwrap_or_else(|_| "llama-3.1-8b-instant".into()),
        max_tokens: std::env::var("AI_MAX_TOKENS")
            .or_else(|_| std::env::var("CLAUDE_MAX_TOKENS"))
            .unwrap_or_else(|_| "2048".into())
            .parse()
            .unwrap_or(2048),
    };

    if config.api_key.is_empty() {
        return Err((StatusCode::SERVICE_UNAVAILABLE, Json(serde_json::json!({"message": "AI API key not configured. Set AI_API_KEY or CLAUDE_API_KEY in .env"}))));
    }

    let client = ClaudeClient::new(config);
    let req = AIRequest {
        feature: body.feature.clone(),
        query: body.query,
        context: body.context,
    };

    let result = client.handle_request(&req).await
        .map_err(|e| (StatusCode::BAD_GATEWAY, Json(serde_json::json!({"message": format!("AI service error: {}", e)}))))?;

    Ok(Json(AIQueryResponse {
        content: result.content,
        feature: result.feature,
        disclaimer: result.disclaimer,
    }))
}
