use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum UnitType {
    Bedsitter,
    OneBed,
    TwoBed,
    ThreeBed,
    Maisonette,
    Shop,
    Office,
    Stall,
    Warehouse,
    Mixed,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum UnitStatus {
    Vacant,
    Occupied,
    Maintenance,
    Reserved,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Property {
    pub id: Uuid,
    pub name: String,
    pub address: String,
    pub city: String,
    pub county: String,
    pub property_type: String,
    pub total_units: i32,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Unit {
    pub id: Uuid,
    pub building_id: Uuid,
    pub unit_number: String,
    pub floor: Option<i32>,
    pub unit_type: UnitType,
    pub rent_amount_kes: f64,
    pub deposit_amount_kes: Option<f64>,
    pub status: UnitStatus,
    pub amenities: Vec<String>,
    pub created_at: DateTime<Utc>,
}
