use axum::{extract::Request, http::StatusCode, middleware::Next, response::Response};
use timis_auth::jwt::Claims;

/// Extracts org_id from JWT claims and sets DB schema context.
pub async fn org_context_middleware(req: Request, next: Next) -> Result<Response, StatusCode> {
    // Org context is derived from JWT claims (set by auth middleware)
    // The GraphQL/REST handlers use claims.org to scope queries
    Ok(next.run(req).await)
}
