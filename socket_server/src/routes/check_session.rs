use axum::{http::StatusCode, response::IntoResponse};
use axum_extra::extract::CookieJar;

use crate::db::verify_user_session;

pub async fn handler(jar: CookieJar) -> impl IntoResponse {
    match jar.get("session_id") {
        Some(cookie) => match verify_user_session(cookie.value()) {
            Ok(_) => StatusCode::OK,
            Err(_) => StatusCode::UNAUTHORIZED,
        },
        None => StatusCode::UNAUTHORIZED,
    };
}
