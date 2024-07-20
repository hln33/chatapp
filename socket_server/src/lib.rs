use std::{
    collections::HashMap,
    net::SocketAddr,
    sync::{Arc, Mutex},
};

use axum::{
    routing::{get, post},
    Router,
};
use tokio::signal;
use tower_http::{
    cors::{Cors, CorsLayer},
    trace::TraceLayer,
};

use session::{create_session_handler, UserSession};
use web_socket::ws_handler;

mod session;
mod web_socket;

#[derive(Default)]
struct AppState {
    pub users: Mutex<HashMap<String, UserSession>>,
}

pub async fn start_server() {
    let app_state = Arc::new(AppState::default());

    let app = Router::new()
        .route("/hello", get(|| async { "hello, you!" }))
        .route("/session", post(create_session_handler))
        .route("/ws", get(ws_handler))
        .with_state(app_state)
        .layer(
            CorsLayer::new()
                .allow_origin(["http://localhost:3000".parse().unwrap()])
                .allow_credentials(true),
        )
        .layer(TraceLayer::new_for_http());

    let listener = tokio::net::TcpListener::bind("127.0.0.1:3001")
        .await
        .unwrap();

    axum::serve(
        listener,
        app.into_make_service_with_connect_info::<SocketAddr>(),
    )
    .with_graceful_shutdown(shutdown_signal())
    .await
    .unwrap();
}

async fn shutdown_signal() {
    let ctrl_c = async {
        signal::ctrl_c().await.unwrap();
    };

    tokio::select! {
        _ = ctrl_c => { println!("ctrl+c detected...") },
    }
}
