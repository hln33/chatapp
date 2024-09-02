use axum::{response::IntoResponse, Json};
use http::StatusCode;
use serde::Deserialize;

use crate::db;

#[derive(Debug, Deserialize)]
pub struct CreateUserData {
    username: String,
    password: String,
}

pub async fn handler(Json(create_user_data): Json<CreateUserData>) -> impl IntoResponse {
    let CreateUserData { username, password } = create_user_data;
    match db::add_user(&username, &password) {
        Ok(_) => StatusCode::OK,
        Err(_) => StatusCode::UNPROCESSABLE_ENTITY,
    }
}
