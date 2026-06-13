use axum::{extract::Request, http::StatusCode, middleware::Next, response::Response};
use timis_auth::jwt::{verify_token, Claims};

pub async fn auth_middleware(mut req: Request, next: Next) -> Result<Response, StatusCode> {
    let auth_header = req.headers()
        .get("authorization")
        .and_then(|v| v.to_str().ok())
        .ok_or(StatusCode::UNAUTHORIZED)?;

    let token = auth_header.strip_prefix("Bearer ").ok_or(StatusCode::UNAUTHORIZED)?;
    let secret = std::env::var("JWT_SECRET").unwrap_or_else(|_| "dev-secret".into());

    let claims = verify_token(token, &secret).map_err(|_| StatusCode::UNAUTHORIZED)?;
    req.extensions_mut().insert(claims);
    Ok(next.run(req).await)
}
