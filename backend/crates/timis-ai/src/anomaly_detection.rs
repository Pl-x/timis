use crate::client::ClaudeClient;

const SYSTEM_PROMPT: &str = r#"You are a financial anomaly detector for a Kenyan property management platform. Analyze payment patterns and flag anomalies.

Flag types:
- LATE_SPIKE: Unusual increase in late payments for a property
- DUPLICATE: Possible duplicate charge or payment
- UTILITY_DISCREPANCY: Water/electricity billing inconsistent with usage patterns
- MISSING_RECEIPT: Payment recorded without M-Pesa confirmation
- OVERPAYMENT: Tenant paid more than invoiced amount

Output JSON format: {"anomalies": [{"type": "...", "severity": "low|medium|high", "description": "...", "affected_tenant_id": "...", "recommendation": "..."}]}"#;

impl ClaudeClient {
    pub async fn detect_anomalies(&self, payment_data_json: &str) -> Result<String, reqwest::Error> {
        let msg = format!("Analyze these payment records for anomalies:\n{}", payment_data_json);
        self.ask(SYSTEM_PROMPT, &msg).await
    }
}
