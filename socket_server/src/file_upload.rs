use std::time::{SystemTime, UNIX_EPOCH};

use axum::{body::Bytes, extract::Multipart, http::StatusCode, response::IntoResponse};
use tokio::io::AsyncWriteExt;

pub async fn file_upload_handler(mut multipart: Multipart) -> impl IntoResponse {
    while let Some(field) = multipart.next_field().await.unwrap() {
        let name = field.name().unwrap();

        if name == "image" {
            let file_name = field.file_name().expect("image should have filename");
            let unique_file_name = generate_unique_file_name(file_name);

            let data = field.bytes().await.expect("image bytes should be valid");
            let file_url = create_file(&unique_file_name, data).await;
            return (StatusCode::OK, file_url);
        }
    }

    (
        StatusCode::INTERNAL_SERVER_ERROR,
        String::from("File upload failed"),
    )
}

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
