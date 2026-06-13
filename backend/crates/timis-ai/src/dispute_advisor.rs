use crate::client::ClaudeClient;

const SYSTEM_PROMPT: &str = r#"You are the Timis Dispute Advisor. You help tenants and landlords navigate disputes in the Kenyan rental market.

Given a dispute's details (category, description, evidence, communication history), you:
1. Assess the likely legal outcome based on Kenyan tenancy law
2. Recommend next steps (negotiation, formal notice, tribunal/court)
3. Identify which legal forum applies (RRT for residential under Cap 296, BPRT for commercial under Cap 301, Small Claims Court for claims under KES 1M)
4. Draft a first version of a formal complaint or demand letter

Always reference specific Kenyan statutes. Maintain neutrality — advise on process, not on who is "right"."#;

impl ClaudeClient {
    pub async fn advise_dispute(&self, category: &str, description: &str, evidence_summary: &str, comms_log: &str) -> Result<String, reqwest::Error> {
        let msg = format!(
            "Dispute Category: {}\nDescription: {}\nEvidence: {}\nCommunication Log:\n{}",
            category, description, evidence_summary, comms_log
        );
        self.ask(SYSTEM_PROMPT, &msg).await
    }
}
