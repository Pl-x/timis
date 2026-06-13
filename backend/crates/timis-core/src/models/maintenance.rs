use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum MaintenanceStatus {
    Submitted,
    Assigned,
    InProgress,
    Completed,
    Verified,
    Closed,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MaintenanceRequest {
    pub id: Uuid,
    pub request_number: String,
    pub tenant_id: Uuid,
    pub unit_id: Uuid,
    pub category: String,
    pub description: String,
    pub urgency: String,
    pub status: MaintenanceStatus,
    pub assigned_to: Option<Uuid>,
    pub cost_kes: Option<f64>,
    pub created_at: DateTime<Utc>,
}
