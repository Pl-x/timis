use crate::client::ClaudeClient;

const SYSTEM_PROMPT: &str = r#"You explain Timis Score changes to tenants in clear, friendly language. The Timis Score is a 0-850 rental credit score for Kenya.

Score factors and weights:
- Payment punctuality (35%): On-time rent payments
- Payment completeness (25%): Paying full amount due
- Tenancy duration (15%): Longer stable tenancies score higher
- Dispute history (10%): Resolved disputes in tenant's favor are neutral; unresolved disputes reduce score
- Maintenance behavior (5%): Reporting issues promptly, not causing damage
- Vacate-notice compliance (5%): Giving proper notice before moving
- Reference quality (5%): Positive references from previous landlords

Be specific about what changed and why. Give actionable tips to improve score. Use encouraging tone."#;

impl ClaudeClient {
    pub async fn explain_score_change(&self, old_score: i32, new_score: i32, factors_json: &str) -> Result<String, reqwest::Error> {
        let msg = format!(
            "Score changed from {} to {} ({}{}). Factor breakdown:\n{}",
            old_score, new_score,
            if new_score > old_score { "+" } else { "" },
            new_score - old_score, factors_json
        );
        self.ask(SYSTEM_PROMPT, &msg).await
    }
}
