use reqwest::Client;
use timis_core::config::AfricasTalkingConfig;

pub struct SmsClient {
    http: Client,
    config: AfricasTalkingConfig,
}

impl SmsClient {
    pub fn new(config: AfricasTalkingConfig) -> Self {
        Self { http: Client::new(), config }
    }

    pub async fn send(&self, to: &str, message: &str) -> Result<(), reqwest::Error> {
        self.http
            .post("https://api.africastalking.com/version1/messaging")
            .header("apiKey", &self.config.api_key)
            .header("Accept", "application/json")
            .form(&[
                ("username", self.config.username.as_str()),
                ("to", to),
                ("message", message),
                ("from", self.config.sender_id.as_str()),
            ])
            .send().await?;
        Ok(())
    }
}
