use axum::{http::StatusCode, response::IntoResponse, Json};
use axum_extra::extract::CookieJar;
use serde::Deserialize;

use crate::db::verify_user_session;

#[derive(Deserialize)]
pub struct RequestData {
    username: String,
}

pub async fn handler(jar: CookieJar, Json(req_data): Json<RequestData>) -> impl IntoResponse {
    match jar.get("session_id") {
        Some(cookie) => match verify_user_session(&req_data.username, cookie.value()) {
            Ok(_) => StatusCode::OK,
            Err(_) => StatusCode::UNAUTHORIZED,
        },
        None => StatusCode::UNAUTHORIZED,
    };
}
