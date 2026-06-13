use sqlx::PgPool;
use redis::aio::ConnectionManager;

#[derive(Clone)]
pub struct AppState {
    pub db: PgPool,
    pub redis: ConnectionManager,
}

impl AppState {
    pub async fn init() -> Self {
        let db_url = std::env::var("DATABASE_URL").expect("DATABASE_URL required");
        let redis_url = std::env::var("REDIS_URL").unwrap_or_else(|_| "redis://127.0.0.1".into());

        let db = timis_db::pool::create_pool(&db_url, 5).await.expect("DB connect failed");

        // Auto-create tables on startup
        timis_db::migrations::run_migrations(&db).await;

        let redis_client = redis::Client::open(redis_url).expect("Redis URL invalid");
        let redis = ConnectionManager::new(redis_client).await.expect("Redis connect failed");

        Self { db, redis }
    }
}
