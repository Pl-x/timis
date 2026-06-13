use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum DisputeStatus {
    Submitted,
    Acknowledged,
    UnderReview,
    Resolved,
    Escalated,
    Closed,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Dispute {
    pub id: Uuid,
    pub dispute_number: String,
    pub tenant_id: Uuid,
    pub unit_id: Uuid,
    pub category: String,
    pub subject: String,
    pub description: String,
    pub status: DisputeStatus,
    pub filed_by: String,
    pub resolution_outcome: Option<String>,
    pub created_at: DateTime<Utc>,
}
