use std::{
    sync::Arc,
    time::{SystemTime, UNIX_EPOCH},
};

use axum::{extract::State, http::StatusCode, response::IntoResponse};
use axum_extra::extract::{cookie::Cookie, CookieJar};
use tracing::debug;
use uuid::Uuid;

use crate::AppState;

pub struct UserSession {
    created: u64,
}

pub async fn create_session_handler(
    State(state): State<Arc<AppState>>,
    jar: CookieJar,
) -> impl IntoResponse {
    let mut jar = jar;

    let session_id = match jar.get("session_id") {
        Some(cookie) => cookie.value().to_string(),
        None => {
            let new_session_id = Uuid::new_v4().to_string();
            jar = jar.add(Cookie::new("session_id", new_session_id.clone()));

            debug!("cookie created: {new_session_id}",);
            new_session_id
        }
    };

    let mut sessions = state.users.lock().unwrap();
    let timestamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs();
    sessions.insert(session_id.clone(), UserSession { created: timestamp });

    (jar, StatusCode::OK)
}
