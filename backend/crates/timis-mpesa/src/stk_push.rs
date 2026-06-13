use base64::Engine;
use base64::engine::general_purpose::STANDARD;
use chrono::Utc;
use serde::{Deserialize, Serialize};
use crate::client::MpesaClient;

#[derive(Serialize)]
#[serde(rename_all = "PascalCase")]
struct StkPushRequest {
    business_short_code: String,
    password: String,
    timestamp: String,
    transaction_type: String,
    amount: u64,
    party_a: String,
    party_b: String,
    phone_number: String,
    call_back_url: String,
    account_reference: String,
    transaction_desc: String,
}

#[derive(Deserialize)]
#[serde(rename_all = "PascalCase")]
pub struct StkPushResponse {
    pub merchant_request_id: Option<String>,
    pub checkout_request_id: Option<String>,
    pub response_code: Option<String>,
    pub response_description: Option<String>,
    pub customer_message: Option<String>,
}

impl MpesaClient {
    pub async fn stk_push(
        &mut self,
        phone: &str,
        amount: u64,
        account_ref: &str,
        description: &str,
    ) -> Result<StkPushResponse, reqwest::Error> {
        let token = self.get_token().await?;
        let timestamp = Utc::now().format("%Y%m%d%H%M%S").to_string();
        let password = STANDARD.encode(format!(
            "{}{}{}",
            self.get_config().shortcode, self.get_config().passkey, timestamp
        ));

        let body = StkPushRequest {
            business_short_code: self.get_config().shortcode.clone(),
            password,
            timestamp,
            transaction_type: "CustomerPayBillOnline".into(),
            amount,
            party_a: phone.into(),
            party_b: self.get_config().shortcode.clone(),
            phone_number: phone.into(),
            call_back_url: self.get_config().callback_url.clone(),
            account_reference: account_ref.into(),
            transaction_desc: description.into(),
        };

        let resp = self.http()
            .post(format!("{}/mpesa/stkpush/v1/processrequest", if self.get_config().environment == "production" { "https://api.safaricom.co.ke" } else { "https://sandbox.safaricom.co.ke" }))
            .bearer_auth(&token)
            .json(&body)
            .send().await?
            .json().await?;

        Ok(resp)
    }
}
