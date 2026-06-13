mod jobs;

#[tokio::main]
async fn main() {
    dotenvy::dotenv().ok();
    dotenvy::from_filename("../.env").ok();

    println!("[TIMIS Worker] Starting...");

    let db_url = std::env::var("DATABASE_URL").expect("DATABASE_URL required");
    println!("[TIMIS Worker] DATABASE_URL loaded. Connecting...");

    let pool = match timis_db::pool::create_pool(&db_url, 2).await {
        Ok(p) => { println!("[TIMIS Worker] Connected to database!"); p }
        Err(e) => { eprintln!("[TIMIS Worker] DB connection FAILED: {}", e); std::process::exit(1); }
    };

    println!("[TIMIS Worker] Running scheduled jobs (lease alerts, invoicing, score recalc)...");

    tokio::select! {
        _ = jobs::lease_expiry_alerts(&pool) => {},
        _ = jobs::invoice_generation(&pool) => {},
        _ = jobs::score_recalculation(&pool) => {},
    }
}
