use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum TenantStatus {
    Applicant,
    Active,
    Vacated,
    Blacklisted,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Tenant {
    pub id: Uuid,
    pub first_name: String,
    pub last_name: String,
    pub email: Option<String>,
    pub phone: String,
    pub id_number: String,
    pub status: TenantStatus,
    pub occupation: Option<String>,
    pub employer_name: Option<String>,
    pub monthly_income_kes: Option<f64>,
    pub next_of_kin_name: Option<String>,
    pub next_of_kin_phone: Option<String>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct CreateTenant {
    pub first_name: String,
    pub last_name: String,
    pub email: Option<String>,
    pub phone: String,
    pub id_type: String,
    pub id_number: String,
    pub occupation: Option<String>,
    pub employer_name: Option<String>,
    pub monthly_income_kes: Option<f64>,
    pub next_of_kin_name: Option<String>,
    pub next_of_kin_phone: Option<String>,
    pub next_of_kin_relation: Option<String>,
}
