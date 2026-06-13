use axum::{extract::State, Json};
use serde::Serialize;
use sqlx::Row;
use crate::state::AppState;

#[derive(Serialize)]
pub struct DashboardOverview {
    stats: Stats,
    properties: Vec<PropertyProgress>,
    #[serde(rename = "expiringLeases")]
    expiring_leases: Vec<ExpiringLease>,
    activities: Vec<Activity>,
}

#[derive(Serialize)]
struct Stats {
    occupied: String,
    collected: String,
    maintenance: String,
    disputes: String,
}

#[derive(Serialize)]
struct PropertyProgress {
    name: String,
    paid: i64,
    total: i64,
}

#[derive(Serialize)]
struct ExpiringLease {
    tenant: String,
    unit: String,
    days: i64,
}

#[derive(Serialize)]
struct Activity {
    r#type: String,
    message: String,
    timestamp: String,
}

pub async fn overview(State(state): State<AppState>) -> Json<DashboardOverview> {
    // Total units and occupied
    let total_units: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM units")
        .fetch_one(&state.db).await.unwrap_or(0);
    let occupied: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM units WHERE status = 'occupied'")
        .fetch_one(&state.db).await.unwrap_or(0);

    // Rent collected this month
    let collected: f64 = sqlx::query_scalar(
        "SELECT COALESCE(SUM(amount_kes), 0) FROM payments WHERE status = 'confirmed' AND paid_at >= date_trunc('month', CURRENT_DATE)"
    ).fetch_one(&state.db).await.unwrap_or(0.0);

    // Pending maintenance
    let maint: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM maintenance_requests WHERE status IN ('submitted', 'assigned', 'in_progress')")
        .fetch_one(&state.db).await.unwrap_or(0);

    // Active disputes
    let disputes: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM disputes WHERE status IN ('submitted', 'acknowledged', 'under_review')")
        .fetch_one(&state.db).await.unwrap_or(0);

    // Property rent progress
    let prop_rows = sqlx::query(
        "SELECT p.name, COUNT(u.id) as total, COUNT(CASE WHEN u.status = 'occupied' THEN 1 END) as paid FROM properties p JOIN buildings b ON b.property_id = p.id JOIN units u ON u.building_id = b.id GROUP BY p.name LIMIT 5"
    ).fetch_all(&state.db).await.unwrap_or_default();

    let properties: Vec<PropertyProgress> = prop_rows.iter().map(|r| PropertyProgress {
        name: r.get("name"),
        paid: r.get("paid"),
        total: r.get("total"),
    }).collect();

    // Expiring leases (next 30 days)
    let lease_rows = sqlx::query(
        "SELECT t.first_name || ' ' || t.last_name as tenant, u.unit_number as unit, (l.end_date - CURRENT_DATE) as days FROM leases l JOIN tenants t ON t.id = l.tenant_id JOIN units u ON u.id = l.unit_id WHERE l.status = 'active' AND l.end_date BETWEEN CURRENT_DATE AND CURRENT_DATE + 30 ORDER BY l.end_date LIMIT 5"
    ).fetch_all(&state.db).await.unwrap_or_default();

    let expiring_leases: Vec<ExpiringLease> = lease_rows.iter().map(|r| ExpiringLease {
        tenant: r.get("tenant"),
        unit: r.get("unit"),
        days: r.get("days"),
    }).collect();

    // Recent activity (last 10 payments)
    let payment_rows = sqlx::query(
        "SELECT p.amount_kes, t.first_name || ' ' || t.last_name as tenant, u.unit_number, p.paid_at FROM payments p JOIN tenants t ON t.id = p.tenant_id LEFT JOIN invoices i ON i.id = p.invoice_id LEFT JOIN leases l ON l.id = i.lease_id LEFT JOIN units u ON u.id = l.unit_id WHERE p.status = 'confirmed' ORDER BY p.paid_at DESC LIMIT 5"
    ).fetch_all(&state.db).await.unwrap_or_default();

    let activities: Vec<Activity> = payment_rows.iter().map(|r| {
        let amount: f64 = r.get("amount_kes");
        let tenant: String = r.get("tenant");
        let unit: Option<String> = r.try_get("unit_number").ok();
        Activity {
            r#type: "payment".into(),
            message: format!("KES {} received from {}{}", format_kes(amount), tenant, unit.map(|u| format!(" — Unit {}", u)).unwrap_or_default()),
            timestamp: "Recently".into(),
        }
    }).collect();

    Json(DashboardOverview {
        stats: Stats {
            occupied: format!("{} / {}", occupied, total_units),
            collected: format!("KES {}", format_kes(collected)),
            maintenance: maint.to_string(),
            disputes: disputes.to_string(),
        },
        properties,
        expiring_leases,
        activities,
    })
}

fn format_kes(amount: f64) -> String {
    let int = amount as i64;
    let s = int.to_string();
    let mut result = String::new();
    for (i, c) in s.chars().rev().enumerate() {
        if i > 0 && i % 3 == 0 { result.push(','); }
        result.push(c);
    }
    result.chars().rev().collect()
}
