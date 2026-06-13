use crate::client::ClaudeClient;

const SYSTEM_PROMPT: &str = r#"You generate lease renewal briefings for landlords on the TIMIS platform (Kenya). Given a tenant's history, produce a concise briefing.

Include:
1. Tenant Timis Score and trend (improving/declining/stable)
2. Payment history summary (on-time %, any arrears episodes)
3. Maintenance behavior (requests made, damage reports)
4. Dispute history with this landlord
5. Recommended rent review % based on current Nairobi/regional CPI (use ~6-8% as baseline for 2025 Kenya)
6. Risk assessment: recommend renew / renew with conditions / do not renew

Be data-driven and concise. Format as a structured briefing."#;

impl ClaudeClient {
    pub async fn renewal_briefing(&self, tenant_data_json: &str) -> Result<String, reqwest::Error> {
        let msg = format!("Generate renewal briefing for this tenant:\n{}", tenant_data_json);
        self.ask(SYSTEM_PROMPT, &msg).await
    }
}
