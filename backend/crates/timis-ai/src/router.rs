use crate::client::ClaudeClient;
use serde::{Deserialize, Serialize};
use serde_json::Value;

/// Unified AI feature router — dispatches to the correct feature handler
/// based on the `feature` field in the request.

#[derive(Debug, Deserialize)]
pub struct AIRequest {
    pub feature: String,
    pub query: String,
    pub context: Option<Value>,
}

#[derive(Debug, Serialize)]
pub struct AIResult {
    pub content: String,
    pub feature: String,
    pub tokens_used: Option<u32>,
    pub disclaimer: Option<String>,
}

impl ClaudeClient {
    /// Main dispatcher for all 7 AI features
    pub async fn handle_request(&self, req: &AIRequest) -> Result<AIResult, reqwest::Error> {
        let (content, disclaimer) = match req.feature.as_str() {
            "legal_assistant" => {
                let ctx = req.context.as_ref()
                    .and_then(|c| c.get("lease_context"))
                    .and_then(|v| v.as_str());
                let resp = self.legal_query(&req.query, ctx).await?;
                (resp, Some("This is general legal information, not legal advice. Consult a licensed Kenyan advocate for specific representation.".to_string()))
            }
            "lease_analyzer" => {
                let resp = self.analyze_lease(&req.query).await?;
                (resp, Some("AI analysis is advisory only. Have a qualified advocate review your agreement.".to_string()))
            }
            "dispute_advisor" => {
                let category = req.context.as_ref()
                    .and_then(|c| c.get("category"))
                    .and_then(|v| v.as_str())
                    .unwrap_or("general");
                let evidence = req.context.as_ref()
                    .and_then(|c| c.get("evidence_summary"))
                    .and_then(|v| v.as_str())
                    .unwrap_or("");
                let comms = req.context.as_ref()
                    .and_then(|c| c.get("comms_log"))
                    .and_then(|v| v.as_str())
                    .unwrap_or("");
                let resp = self.advise_dispute(category, &req.query, evidence, comms).await?;
                (resp, Some("AI-generated guidance. Not a substitute for legal counsel.".to_string()))
            }
            "anomaly_detection" => {
                let resp = self.detect_anomalies(&req.query).await?;
                (resp, None)
            }
            "score_explainer" => {
                let old_score = req.context.as_ref()
                    .and_then(|c| c.get("old_score"))
                    .and_then(|v| v.as_i64())
                    .unwrap_or(0) as i32;
                let new_score = req.context.as_ref()
                    .and_then(|c| c.get("new_score"))
                    .and_then(|v| v.as_i64())
                    .unwrap_or(0) as i32;
                let resp = self.explain_score_change(old_score, new_score, &req.query).await?;
                (resp, None)
            }
            "vacancy_copy" => {
                let location = req.context.as_ref()
                    .and_then(|c| c.get("location"))
                    .and_then(|v| v.as_str())
                    .unwrap_or("");
                let amenities = req.context.as_ref()
                    .and_then(|c| c.get("amenities"))
                    .and_then(|v| v.as_str())
                    .unwrap_or("");
                let resp = self.generate_listing(&req.query, location, amenities).await?;
                (resp, None)
            }
            "renewal_briefing" => {
                let resp = self.renewal_briefing(&req.query).await?;
                (resp, None)
            }
            _ => {
                ("Unknown AI feature. Available: legal_assistant, lease_analyzer, dispute_advisor, anomaly_detection, score_explainer, vacancy_copy, renewal_briefing".to_string(), None)
            }
        };

        Ok(AIResult {
            content,
            feature: req.feature.clone(),
            tokens_used: None, // Populated from response headers in production
            disclaimer,
        })
    }
}
