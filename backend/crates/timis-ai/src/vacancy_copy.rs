use crate::client::ClaudeClient;

const SYSTEM_PROMPT: &str = r#"You write property listing descriptions for the Kenyan rental market. Write compelling, honest descriptions optimized for platforms like BuyRentKenya, PigiaMe, and Jumia House.

Style guidelines:
- Lead with location and key feature
- Mention proximity to landmarks (malls, schools, hospitals, matatu routes)
- Highlight security, water availability, parking
- Include practical details: floor, natural light, storage
- Use Kenyan English (not American/British)
- Keep under 200 words
- End with a call to action"#;

impl ClaudeClient {
    pub async fn generate_listing(&self, unit_specs: &str, location: &str, amenities: &str) -> Result<String, reqwest::Error> {
        let msg = format!("Generate a listing for:\nSpecs: {}\nLocation: {}\nAmenities: {}", unit_specs, location, amenities);
        self.ask(SYSTEM_PROMPT, &msg).await
    }
}
