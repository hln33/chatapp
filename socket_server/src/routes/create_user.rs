use axum::{response::IntoResponse, Json};
use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct CreateUserData {
    username: String,
    password: String,
}

pub async fn handler(Json(create_user_data): Json<CreateUserData>) -> impl IntoResponse {}
