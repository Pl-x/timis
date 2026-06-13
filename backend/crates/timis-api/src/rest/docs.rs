use axum::response::{Html, IntoResponse};

/// Serves Swagger UI that loads the OpenAPI spec.
pub async fn swagger_ui() -> impl IntoResponse {
    Html(r#"<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>TIMIS API — Swagger UI</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    window.onload = () => {
      window.ui = SwaggerUIBundle({
        url: '/openapi.yaml',
        dom_id: '#swagger-ui',
        presets: [SwaggerUIBundle.presets.apis],
        layout: 'BaseLayout',
      });
    };
  </script>
</body>
</html>"#)
}

/// Serves the raw OpenAPI YAML spec.
pub async fn openapi_spec() -> impl IntoResponse {
    let spec = include_str!("../../openapi.yaml");
    ([("content-type", "application/yaml")], spec)
}
