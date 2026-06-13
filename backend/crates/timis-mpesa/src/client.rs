use base64::Engine;
use base64::engine::general_purpose::STANDARD;
use reqwest::Client;
use serde::Deserialize;
use timis_core::config::MpesaConfig;

#[derive(Clone)]
pub struct MpesaClient {
    http: Client,
    config: MpesaConfig,
    token: Option<String>,
}

#[derive(Deserialize)]
struct TokenResponse {
    access_token: String,
    expires_in: String,
}

impl MpesaClient {
    pub fn new(config: MpesaConfig) -> Self {
        Self { http: Client::new(), config, token: None }
    }

    fn base_url(&self) -> &str {
        if self.config.environment == "production" {
            "https://api.safaricom.co.ke"
        } else {
            "https://sandbox.safaricom.co.ke"
        }
    }

    pub async fn get_token(&mut self) -> Result<String, reqwest::Error> {
        let credentials = STANDARD.encode(format!("{}:{}", self.config.consumer_key, self.config.consumer_secret));
        let resp: TokenResponse = self.http
            .get(format!("{}/oauth/v1/generate?grant_type=client_credentials", self.base_url()))
            .header("Authorization", format!("Basic {}", credentials))
            .send().await?
            .json().await?;
        self.token = Some(resp.access_token.clone());
        Ok(resp.access_token)
    }

    pub fn token(&self) -> Option<&str> {
        self.token.as_deref()
    }

    pub fn get_config(&self) -> &MpesaConfig {
        &self.config
    }

    pub fn http(&self) -> &Client {
        &self.http
    }
}
