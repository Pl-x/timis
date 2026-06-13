use reqwest::Client;
use serde::{Deserialize, Serialize};
use timis_core::config::ClaudeConfig;

#[derive(Clone)]
pub struct ClaudeClient {
    http: Client,
    config: ClaudeConfig,
}

#[derive(Serialize)]
struct Message {
    role: String,
    content: String,
}

// Anthropic format
#[derive(Serialize)]
struct ClaudeRequest {
    model: String,
    max_tokens: u32,
    system: String,
    messages: Vec<Message>,
}

// OpenAI-compatible format (works with Groq, Together, OpenAI, Ollama)
#[derive(Serialize)]
struct OpenAIRequest {
    model: String,
    max_tokens: u32,
    messages: Vec<OpenAIMessage>,
}

#[derive(Serialize)]
struct OpenAIMessage {
    role: String,
    content: String,
}

#[derive(Deserialize)]
pub struct ClaudeResponse {
    pub content: Vec<ContentBlock>,
}

#[derive(Deserialize)]
pub struct ContentBlock {
    pub text: String,
}

#[derive(Deserialize)]
struct OpenAIResponse {
    choices: Vec<OpenAIChoice>,
}

#[derive(Deserialize)]
struct OpenAIChoice {
    message: OpenAIMsg,
}

#[derive(Deserialize)]
struct OpenAIMsg {
    content: String,
}

impl ClaudeClient {
    pub fn new(config: ClaudeConfig) -> Self {
        Self { http: Client::new(), config }
    }

    /// Unified ask method — routes to Anthropic or OpenAI-compatible API based on AI_PROVIDER env
    pub async fn ask(&self, system_prompt: &str, user_message: &str) -> Result<String, reqwest::Error> {
        let provider = std::env::var("AI_PROVIDER").unwrap_or_else(|_| "anthropic".into());

        match provider.as_str() {
            "openai" | "groq" | "together" | "ollama" => {
                self.ask_openai_compatible(system_prompt, user_message).await
            }
            _ => {
                self.ask_anthropic(system_prompt, user_message).await
            }
        }
    }

    async fn ask_anthropic(&self, system_prompt: &str, user_message: &str) -> Result<String, reqwest::Error> {
        let body = ClaudeRequest {
            model: self.config.model.clone(),
            max_tokens: self.config.max_tokens,
            system: system_prompt.into(),
            messages: vec![Message { role: "user".into(), content: user_message.into() }],
        };

        let resp: ClaudeResponse = self.http
            .post("https://api.anthropic.com/v1/messages")
            .header("x-api-key", &self.config.api_key)
            .header("anthropic-version", "2024-01-01")
            .header("content-type", "application/json")
            .json(&body)
            .send().await?
            .json().await?;

        Ok(resp.content.first().map(|c| c.text.clone()).unwrap_or_default())
    }

    async fn ask_openai_compatible(&self, system_prompt: &str, user_message: &str) -> Result<String, reqwest::Error> {
        let base_url = std::env::var("AI_BASE_URL").unwrap_or_else(|_| "https://api.groq.com/openai/v1".into());

        let body = OpenAIRequest {
            model: self.config.model.clone(),
            max_tokens: self.config.max_tokens,
            messages: vec![
                OpenAIMessage { role: "system".into(), content: system_prompt.into() },
                OpenAIMessage { role: "user".into(), content: user_message.into() },
            ],
        };

        let resp: OpenAIResponse = self.http
            .post(format!("{}/chat/completions", base_url))
            .bearer_auth(&self.config.api_key)
            .header("content-type", "application/json")
            .json(&body)
            .send().await?
            .json().await?;

        Ok(resp.choices.first().map(|c| c.message.content.clone()).unwrap_or_default())
    }
}
