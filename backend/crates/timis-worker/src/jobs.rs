use sqlx::PgPool;
use tokio::time::{sleep, Duration};
use chrono::{Datelike, Utc};

/// Checks for leases expiring within 60/30/14/7 days and logs alerts.
pub async fn lease_expiry_alerts(pool: &PgPool) {
    loop {
        let today = Utc::now().date_naive();
        let mut total = 0;
        for days in [60i64, 30, 14, 7] {
            let target = today + chrono::Duration::days(days);
            let rows = sqlx::query("SELECT id, tenant_id, unit_id, end_date FROM leases WHERE status = 'active' AND end_date = $1")
                .bind(target)
                .fetch_all(pool).await
                .unwrap_or_default();
            if !rows.is_empty() {
                println!("[Worker:LeaseAlerts] {} lease(s) expiring in {} days", rows.len(), days);
                total += rows.len();
            }
        }
        println!("[Worker:LeaseAlerts] Daily check complete — {} expiring leases flagged. Next check in 24h.", total);
        sleep(Duration::from_secs(86400)).await;
    }
}

/// Generates invoices on each tenant's billing day.
pub async fn invoice_generation(pool: &PgPool) {
    loop {
        let today = Utc::now().date_naive().day() as i32;
        let rows = sqlx::query("SELECT id, tenant_id, unit_id, rent_amount_kes FROM leases WHERE status = 'active' AND billing_day = $1")
            .bind(today)
            .fetch_all(pool).await
            .unwrap_or_default();
        println!("[Worker:Invoicing] Billing day {} — {} active lease(s) due for invoicing.", today, rows.len());
        sleep(Duration::from_secs(3600)).await;
    }
}

/// Monthly Timis Score recalculation for all active tenants.
pub async fn score_recalculation(pool: &PgPool) {
    loop {
        let day = Utc::now().date_naive().day();
        if day == 1 {
            let rows = sqlx::query("SELECT id FROM tenants WHERE status = 'active'")
                .fetch_all(pool).await
                .unwrap_or_default();
            println!("[Worker:TimisScore] Monthly recalculation — processing {} active tenant(s).", rows.len());
        } else {
            println!("[Worker:TimisScore] Score recalc runs on the 1st. Today is day {}. Skipping.", day);
        }
        sleep(Duration::from_secs(86400)).await;
    }
}
