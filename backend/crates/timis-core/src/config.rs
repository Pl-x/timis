use serde::Deserialize;

#[derive(Debug, Clone, Deserialize)]
pub struct AppConfig {
    pub server: ServerConfig,
    pub database: DatabaseConfig,
    pub redis: RedisConfig,
    pub rabbitmq: RabbitmqConfig,
    pub mpesa: MpesaConfig,
    pub claude: ClaudeConfig,
    pub africastalking: AfricasTalkingConfig,
    pub jwt: JwtConfig,
    pub encryption: EncryptionConfig,
}

#[derive(Debug, Clone, Deserialize)]
pub struct ServerConfig {
    pub host: String,
    pub port: u16,
}

#[derive(Debug, Clone, Deserialize)]
pub struct DatabaseConfig {
    pub url: String,
    pub max_connections: u32,
}

#[derive(Debug, Clone, Deserialize)]
pub struct RedisConfig {
    pub url: String,
}

#[derive(Debug, Clone, Deserialize)]
pub struct RabbitmqConfig {
    pub url: String,
}

#[derive(Debug, Clone, Deserialize)]
pub struct MpesaConfig {
    pub consumer_key: String,
    pub consumer_secret: String,
    pub passkey: String,
    pub shortcode: String,
    pub callback_url: String,
    pub environment: String, // "sandbox" or "production"
}

#[derive(Debug, Clone, Deserialize)]
pub struct ClaudeConfig {
    pub api_key: String,
    pub model: String,
    pub max_tokens: u32,
}

#[derive(Debug, Clone, Deserialize)]
pub struct AfricasTalkingConfig {
    pub api_key: String,
    pub username: String,
    pub sender_id: String,
}

#[derive(Debug, Clone, Deserialize)]
pub struct JwtConfig {
    pub secret: String,
    pub expiry_hours: u64,
    pub refresh_expiry_days: u64,
}

#[derive(Debug, Clone, Deserialize)]
pub struct EncryptionConfig {
    pub pii_key: String, // AES-256 key (base64)
}
