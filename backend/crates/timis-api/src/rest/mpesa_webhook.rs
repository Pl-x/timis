use axum::{extract::State, Json, http::StatusCode};
use serde::{Deserialize, Serialize};
use crate::state::AppState;

#[derive(Deserialize)]
pub struct MpesaCallbackBody {
    #[serde(rename = "Body")]
    body: MpesaBody,
}

#[derive(Deserialize)]
struct MpesaBody {
    #[serde(rename = "stkCallback")]
    stk_callback: StkCallback,
}

#[derive(Deserialize)]
struct StkCallback {
    #[serde(rename = "MerchantRequestID")]
    merchant_request_id: String,
    #[serde(rename = "CheckoutRequestID")]
    checkout_request_id: String,
    #[serde(rename = "ResultCode")]
    result_code: i32,
    #[serde(rename = "ResultDesc")]
    result_desc: String,
}

pub async fn mpesa_callback(
    State(state): State<AppState>,
    Json(payload): Json<MpesaCallbackBody>,
) -> StatusCode {
    let cb = &payload.body.stk_callback;
    tracing::info!(
        checkout_id = %cb.checkout_request_id,
        result_code = cb.result_code,
        "M-Pesa STK callback received"
    );

    if cb.result_code == 0 {
        // Payment successful — match to pending transaction, record, update invoice
        // This is handled by timis-mpesa crate reconciliation logic
    }

    StatusCode::OK
}

pub async fn mpesa_validation(
    State(_state): State<AppState>,
    Json(_payload): Json<serde_json::Value>,
) -> Json<serde_json::Value> {
    // Accept all C2B transactions (validation URL)
    Json(serde_json::json!({"ResultCode": 0, "ResultDesc": "Accepted"}))
}
