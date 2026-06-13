use base64::Engine;
use base64::engine::general_purpose::STANDARD;
use chrono::Utc;
use serde::{Deserialize, Serialize};
use crate::client::MpesaClient;

/// B2C payment (landlord payouts, deposit refunds)
#[derive(Serialize)]
#[serde(rename_all = "PascalCase")]
struct B2CRequest {
    initiator_name: String,
    security_credential: String,
    command_id: String,
    amount: u64,
    party_a: String,     // shortcode
    party_b: String,     // recipient phone
    remarks: String,
    queue_time_out_url: String,
    result_url: String,
    occasion: String,
}

#[derive(Deserialize)]
pub struct B2CResponse {
    #[serde(rename = "ConversationID")]
    pub conversation_id: Option<String>,
    #[serde(rename = "ResponseCode")]
    pub response_code: Option<String>,
    #[serde(rename = "ResponseDescription")]
    pub response_description: Option<String>,
}

impl MpesaClient {
    /// Send money to a phone number (landlord payout or deposit refund)
    pub async fn b2c_payment(
        &mut self,
        phone: &str,
        amount: u64,
        remarks: &str,
        occasion: &str,
    ) -> Result<B2CResponse, reqwest::Error> {
        let token = self.get_token().await?;
        let base = if self.get_config().environment == "production" {
            "https://api.safaricom.co.ke"
        } else {
            "https://sandbox.safaricom.co.ke"
        };

        let body = B2CRequest {
            initiator_name: "TimisAPI".into(),
            security_credential: self.get_config().passkey.clone(), // In production: encrypted credential
            command_id: "BusinessPayment".into(),
            amount,
            party_a: self.get_config().shortcode.clone(),
            party_b: phone.into(),
            remarks: remarks.into(),
            queue_time_out_url: format!("{}/timeout", self.get_config().callback_url),
            result_url: format!("{}/b2c/result", self.get_config().callback_url),
            occasion: occasion.into(),
        };

        let resp = self.http()
            .post(format!("{}/mpesa/b2c/v1/paymentrequest", base))
            .bearer_auth(&token)
            .json(&body)
            .send().await?
            .json().await?;

        Ok(resp)
    }
}

/// Transaction status query
#[derive(Serialize)]
#[serde(rename_all = "PascalCase")]
struct TransactionQueryRequest {
    initiator: String,
    security_credential: String,
    command_id: String,
    transaction_id: String,
    party_a: String,
    identifier_type: String,
    result_url: String,
    queue_time_out_url: String,
    remarks: String,
    occasion: String,
}

impl MpesaClient {
    /// Query transaction status (verify if payment was successful)
    pub async fn query_transaction(
        &mut self,
        transaction_id: &str,
    ) -> Result<serde_json::Value, reqwest::Error> {
        let token = self.get_token().await?;
        let base = if self.get_config().environment == "production" {
            "https://api.safaricom.co.ke"
        } else {
            "https://sandbox.safaricom.co.ke"
        };

        let body = TransactionQueryRequest {
            initiator: "TimisAPI".into(),
            security_credential: self.get_config().passkey.clone(),
            command_id: "TransactionStatusQuery".into(),
            transaction_id: transaction_id.into(),
            party_a: self.get_config().shortcode.clone(),
            identifier_type: "4".into(), // Shortcode
            result_url: format!("{}/query/result", self.get_config().callback_url),
            queue_time_out_url: format!("{}/timeout", self.get_config().callback_url),
            remarks: "Payment verification".into(),
            occasion: "".into(),
        };

        let resp = self.http()
            .post(format!("{}/mpesa/transactionstatus/v1/query", base))
            .bearer_auth(&token)
            .json(&body)
            .send().await?
            .json().await?;

        Ok(resp)
    }
}

/// C2B URL registration (one-time setup)
impl MpesaClient {
    pub async fn register_c2b_urls(
        &mut self,
        validation_url: &str,
        confirmation_url: &str,
    ) -> Result<serde_json::Value, reqwest::Error> {
        let token = self.get_token().await?;
        let base = if self.get_config().environment == "production" {
            "https://api.safaricom.co.ke"
        } else {
            "https://sandbox.safaricom.co.ke"
        };

        let body = serde_json::json!({
            "ShortCode": self.get_config().shortcode,
            "ResponseType": "Completed",
            "ConfirmationURL": confirmation_url,
            "ValidationURL": validation_url
        });

        let resp = self.http()
            .post(format!("{}/mpesa/c2b/v1/registerurl", base))
            .bearer_auth(&token)
            .json(&body)
            .send().await?
            .json().await?;

        Ok(resp)
    }
}
