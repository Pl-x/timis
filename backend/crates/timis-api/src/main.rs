use axum::{Router, routing::get};
use tower_http::cors::CorsLayer;
use tower_http::compression::CompressionLayer;
use tower_http::trace::TraceLayer;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
use std::net::SocketAddr;

mod graphql;
mod rest;
mod middleware;
mod state;

#[tokio::main]
async fn main() {
    dotenvy::dotenv().ok();

    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::new(
            std::env::var("RUST_LOG").unwrap_or_else(|_| "kiro_api=debug,tower_http=debug".into()),
        ))
        .with(tracing_subscriber::fmt::layer().json())
        .init();

    let state = state::AppState::init().await;

    let app = Router::new()
        .nest("/graphql", graphql::router(state.clone()))
        .nest("/api/v1", rest::router(state.clone()))
        .route("/docs", get(rest::docs::swagger_ui))
        .route("/openapi.yaml", get(rest::docs::openapi_spec))
        .route("/health", get(|| async { "ok" }))
        .layer(CorsLayer::permissive())
        .layer(CompressionLayer::new())
        .layer(TraceLayer::new_for_http());

    let addr = SocketAddr::from(([0, 0, 0, 0], 8080));
    tracing::info!("TIMIS API listening on {}", addr);
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
