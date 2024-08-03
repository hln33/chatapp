use axum::{
    body::Bytes,
    extract::{multipart::Field, Multipart},
    http::StatusCode,
    response::IntoResponse,
};
use std::time::{SystemTime, UNIX_EPOCH};
use tokio::io::AsyncWriteExt;

fn generate_unique_file_name(file_name: &str) -> String {
    let timestamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs();
    format!("{timestamp}_{file_name}")
}

// returns URL to newly created file
async fn create_file(file_name: &str, bytes: Bytes) -> String {
    let file_path = format!("./public/uploads/{file_name}");
    let mut file = tokio::fs::File::create(&file_path)
        .await
        .expect("file creation should be successful");

    file.write_all(&bytes)
        .await
        .expect("file writing should be successful");

    format!("uploads/{file_name}")
}

async fn upload_image(field: Field<'_>) -> Result<String, &str> {
    match field.file_name() {
        Some(file_name) => {
            let unique_file_name = generate_unique_file_name(file_name);
            let data = field.bytes().await.expect("image bytes should be valid");
            Ok(create_file(&unique_file_name, data).await)
        }
        None => Err("Image should have filename"),
    }
}

pub async fn file_upload_handler(mut multipart: Multipart) -> impl IntoResponse {
    while let Some(field) = multipart.next_field().await.unwrap() {
        let name = field.name().unwrap();
        if name == "image" {
            return match upload_image(field).await {
                Ok(file_url) => (StatusCode::OK, file_url),
                Err(err) => (StatusCode::BAD_REQUEST, err.to_string()),
            };
        }
    }

    (
        StatusCode::INTERNAL_SERVER_ERROR,
        String::from("File upload failed"),
    )
}
