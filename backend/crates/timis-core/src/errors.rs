use thiserror::Error;

#[derive(Debug, Error)]
pub enum TimisError {
    #[error("Not found: {0}")]
    NotFound(String),
    #[error("Unauthorized: {0}")]
    Unauthorized(String),
    #[error("Forbidden: {0}")]
    Forbidden(String),
    #[error("Validation: {0}")]
    Validation(String),
    #[error("Conflict: {0}")]
    Conflict(String),
    #[error("Database: {0}")]
    Database(String),
    #[error("External service: {0}")]
    ExternalService(String),
    #[error("Internal: {0}")]
    Internal(String),
}

impl TimisError {
    pub fn status_code(&self) -> u16 {
        match self {
            Self::NotFound(_) => 404,
            Self::Unauthorized(_) => 401,
            Self::Forbidden(_) => 403,
            Self::Validation(_) => 400,
            Self::Conflict(_) => 409,
            Self::Database(_) => 500,
            Self::ExternalService(_) => 502,
            Self::Internal(_) => 500,
        }
    }
}
