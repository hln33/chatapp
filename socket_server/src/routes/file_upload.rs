use axum::{
    body::Bytes,
    extract::{multipart::Field, Multipart},
    http::StatusCode,
    response::IntoResponse,
};
use std::time::{SystemTime, UNIX_EPOCH};
use tokio::io::AsyncWriteExt;

fn is_image(content_type: &str) -> bool {
    matches!(content_type, "image/png" | "image/jpeg")
}

fn generate_unique_file_name(file_name: &str) -> String {
    let timestamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs();
    format!("{timestamp}_{file_name}")
}

// returns URL to newly created file
async fn create_file(file_name: &str, bytes: Bytes) -> Result<String, String> {
    let file_path = format!("./public/uploads/{file_name}");

    match tokio::fs::File::create(&file_path).await {
        Ok(mut file) => {
            if (file.write_all(&bytes).await).is_err() {
                return Err("File writing failed".to_string());
            }
            Ok(format!("uploads/{file_name}"))
        }
        Err(_) => Err("File creation failed".to_string()),
    }
}

async fn upload_image(field: Field<'_>) -> Result<String, String> {
    match field.file_name() {
        Some(file_name) => {
            let unique_file_name = generate_unique_file_name(file_name);
            let data = field.bytes().await.expect("image bytes should be valid");

            let new_image_url = create_file(&unique_file_name, data).await?;
            Ok(new_image_url)
        }
        None => Err("Image should have filename".to_string()),
    }
}

pub async fn file_upload_handler(mut multipart: Multipart) -> impl IntoResponse {
    let mut file_urls = Vec::new();

    while let Some(field) = multipart.next_field().await.unwrap() {
        if field.name().unwrap() == "images" && is_image(field.content_type().unwrap()) {
            match upload_image(field).await {
                Ok(file_url) => file_urls.push(file_url),
                Err(err_msg) => return (StatusCode::BAD_REQUEST, err_msg),
            };
        }
    }

    match serde_json::to_string(&file_urls) {
        Ok(file_urls) => (StatusCode::OK, file_urls),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()),
    }
}
