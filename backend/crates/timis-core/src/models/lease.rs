use chrono::{DateTime, NaiveDate, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum LeaseStatus {
    Draft,
    Active,
    Renewal,
    Expired,
    Terminated,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Lease {
    pub id: Uuid,
    pub tenant_id: Uuid,
    pub unit_id: Uuid,
    pub status: LeaseStatus,
    pub start_date: NaiveDate,
    pub end_date: NaiveDate,
    pub rent_amount_kes: f64,
    pub deposit_amount_kes: f64,
    pub billing_day: i32,
    pub notice_period_days: i32,
    pub created_at: DateTime<Utc>,
}
