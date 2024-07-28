use axum::{extract::Multipart, http::StatusCode, response::IntoResponse};
use tokio::io::AsyncWriteExt;

pub async fn file_upload_handler(mut multipart: Multipart) -> impl IntoResponse {
    while let Some(field) = multipart.next_field().await.unwrap() {
        let name = field.name().unwrap();

        if name == "image" {
            let file_name = field.file_name().expect("image should have filename");
            let file_path = format!("./public/uploads/{file_name}");
            let data = field.bytes().await.expect("image bytes should be valid");

            let mut file = tokio::fs::File::create(&file_path)
                .await
                .expect("file creation should be successful");
            file.write_all(&data)
                .await
                .expect("file writing should be successful");
        }
    }

    (StatusCode::OK, "File uploaded successfully")
}
