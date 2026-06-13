use axum::{Router, routing::{get, post, put, delete}};
use crate::state::AppState;

mod mpesa_webhook;
mod health;
mod auth;
mod ai;
mod dashboard;
mod tenants;
mod upload;
mod org;
mod properties;

pub fn router(state: AppState) -> Router {
    Router::new()
        .route("/auth/register", post(auth::register))
        .route("/auth/login", post(auth::login))
        .route("/ai/query", post(ai::query))
        .route("/dashboard/overview", get(dashboard::overview))
        .route("/tenants", post(tenants::create_tenant).get(tenants::list_tenants))
        .route("/properties", post(properties::create_property).get(properties::list_properties))
        .route("/orgs/:id", get(org::get_org).put(org::update_org).delete(org::delete_org))
        .route("/orgs/:id/upgrade", post(org::upgrade_org))
        .route("/upload/document", post(upload::upload_document))
        .route("/mpesa/callback", post(mpesa_webhook::mpesa_callback))
        .route("/mpesa/validation", post(mpesa_webhook::mpesa_validation))
        .route("/health", get(health::check))
        .with_state(state)
}
