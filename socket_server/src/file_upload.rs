use axum::{extract::Multipart, response::IntoResponse};
use tracing::info;

pub async fn file_upload_handler(mut multipart: Multipart) -> impl IntoResponse {
    while let Some(field) = multipart.next_field().await.unwrap() {
        let name = field.name().unwrap();
        info!("{name}");
    }
}
