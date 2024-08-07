use std::sync::Arc;

use axum::{extract::State, http::StatusCode, response::IntoResponse, Json};
use axum_extra::extract::{cookie::Cookie, CookieJar};
use serde::Deserialize;
use uuid::Uuid;

use crate::AppState;

// pub struct UserSession {
//     created: u64,
// }

// pub async fn login_handler(
//     State(state): State<Arc<AppState>>,
//     jar: CookieJar,
// ) -> impl IntoResponse {
//     let mut jar = jar;

//     let session_id = match jar.get("session_id") {
//         Some(cookie) => cookie.value().to_string(),
//         None => {
//             let new_session_id = Uuid::new_v4().to_string();
//             jar = jar.add(Cookie::new("session_id", new_session_id.clone()));

//             debug!("cookie created: {new_session_id}",);
//             new_session_id
//         }
//     };

//     let mut sessions = state.users.lock().unwrap();
//     let timestamp = SystemTime::now()
//         .duration_since(UNIX_EPOCH)
//         .unwrap()
//         .as_secs();
//     sessions.insert(session_id.clone(), UserSession { created: timestamp });

//     (jar, StatusCode::OK)
// }

pub struct User {
    pub username: String,
    pub password: String,
}

#[derive(Debug, Deserialize)]
pub struct LoginData {
    username: String,
    password: String,
}

pub async fn login_handler(
    State(state): State<Arc<AppState>>,
    mut jar: CookieJar,
    Json(login_data): Json<LoginData>,
) -> impl IntoResponse {
    let users = state.users.lock().unwrap();
    if let Some(user) = users.get(&login_data.username) {
        if user.password == login_data.password {
            let cookie = Cookie::new("session_id", Uuid::new_v4().to_string());
            jar = jar.add(cookie);

            return (StatusCode::OK, jar, "login successful");
        }
        return (StatusCode::UNAUTHORIZED, jar, "Invalid credentials");
    }

    (StatusCode::INTERNAL_SERVER_ERROR, jar, "unexpected error")
}
