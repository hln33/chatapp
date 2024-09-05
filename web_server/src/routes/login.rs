use axum::{http::StatusCode, response::IntoResponse, Json};
use axum_extra::extract::{cookie::Cookie, CookieJar};
use serde::Deserialize;
use tracing::error;
use uuid::Uuid;

use crate::db;

#[derive(Debug)]
pub struct User {
    pub username: String,
    pub password: String,
}

#[derive(Debug, Deserialize)]
pub struct LoginData {
    username: String,
    password: String,
}

pub async fn handler(mut jar: CookieJar, Json(login_data): Json<LoginData>) -> impl IntoResponse {
    let username = &login_data.username;

    if let Some(user) = db::get_user(username) {
        if user.password == login_data.password {
            let cookie = Cookie::new("session_id", Uuid::new_v4().to_string());

            if db::create_session(username, cookie.value()).is_err() {
                error!("Failed to create a session for {}", username)
            }

            jar = jar.add(cookie);
            return (StatusCode::OK, jar, "login successful");
        }
    }

    (
        StatusCode::INTERNAL_SERVER_ERROR,
        jar,
        "Oops! Wrong username or password",
    )
}
