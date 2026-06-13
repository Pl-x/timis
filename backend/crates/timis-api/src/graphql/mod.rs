use axum::Router;
use axum::routing::any_service;
use async_graphql::{Schema, EmptySubscription};
use async_graphql_axum::GraphQL;

mod query;
mod mutation;
mod types;

use query::QueryRoot;
use mutation::MutationRoot;
use crate::state::AppState;

pub type TimisSchema = Schema<QueryRoot, MutationRoot, EmptySubscription>;

pub fn router(state: AppState) -> Router {
    let schema = Schema::build(QueryRoot, MutationRoot, EmptySubscription)
        .data(state.db.clone())
        .data(state.redis.clone())
        .finish();

    Router::new().route_service("/", GraphQL::new(schema))
}
