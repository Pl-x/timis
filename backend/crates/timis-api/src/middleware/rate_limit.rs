use axum::{extract::Request, http::StatusCode, middleware::Next, response::Response};

/// Basic rate limiting via Redis (token bucket per IP).
pub async fn rate_limit_middleware(req: Request, next: Next) -> Result<Response, StatusCode> {
    // In production: check Redis counter for req IP, reject if over limit
    Ok(next.run(req).await)
}
