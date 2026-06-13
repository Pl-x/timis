use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum PaymentMethod {
    Mpesa,
    BankTransfer,
    Cash,
    Cheque,
    Card,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum PaymentStatus {
    Pending,
    Confirmed,
    Failed,
    Reversed,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Payment {
    pub id: Uuid,
    pub invoice_id: Option<Uuid>,
    pub tenant_id: Uuid,
    pub amount_kes: f64,
    pub method: PaymentMethod,
    pub status: PaymentStatus,
    pub mpesa_receipt_number: Option<String>,
    pub paid_at: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
}
