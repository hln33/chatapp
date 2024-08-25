use axum::{http::StatusCode, response::IntoResponse, Json};
use axum_extra::extract::CookieJar;
use serde::Deserialize;

use crate::db::verify_user_session;

#[derive(Deserialize)]
pub struct RequestData {
    username: String,
}

pub async fn check_session_handler(
    jar: CookieJar,
    Json(req_data): Json<RequestData>,
) -> impl IntoResponse {
    let session_cookie = jar.get("session_id");
    match session_cookie {
        Some(cookie) => {
            let session_id = cookie.value();
            match verify_user_session(&req_data.username, session_id) {
                Ok(_) => StatusCode::OK,
                Err(_) => StatusCode::UNAUTHORIZED,
            }
        }
        None => StatusCode::UNAUTHORIZED,
    };
}
