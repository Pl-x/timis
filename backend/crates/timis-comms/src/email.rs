use reqwest::Client;

pub struct EmailClient {
    http: Client,
    api_key: String,
    from_email: String,
}

impl EmailClient {
    pub fn new(api_key: String, from_email: String) -> Self {
        Self { http: Client::new(), api_key, from_email }
    }

    pub async fn send(&self, to: &str, subject: &str, html_body: &str) -> Result<(), reqwest::Error> {
        // Using SendGrid v3 API
        let body = serde_json::json!({
            "personalizations": [{"to": [{"email": to}]}],
            "from": {"email": &self.from_email},
            "subject": subject,
            "content": [{"type": "text/html", "value": html_body}]
        });

        self.http
            .post("https://api.sendgrid.com/v3/mail/send")
            .bearer_auth(&self.api_key)
            .json(&body)
            .send().await?;
        Ok(())
    }
}
