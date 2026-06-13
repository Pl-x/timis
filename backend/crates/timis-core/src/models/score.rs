use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TimisScore {
    pub id: Uuid,
    pub tenant_id: Uuid,
    pub score: i32,
    pub band: String,
    pub payment_punctuality_score: f64,
    pub payment_completeness_score: f64,
    pub tenancy_duration_score: f64,
    pub dispute_history_score: f64,
    pub maintenance_behavior_score: f64,
    pub vacate_compliance_score: f64,
    pub reference_quality_score: f64,
    pub calculated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ScoreHistory {
    pub id: Uuid,
    pub tenant_id: Uuid,
    pub score: i32,
    pub change_amount: i32,
    pub change_reason: String,
    pub calculated_at: DateTime<Utc>,
}
