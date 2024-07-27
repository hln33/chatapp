use std::{
    collections::HashMap,
    net::SocketAddr,
    sync::{Arc, Mutex},
};

use axum::{
    routing::{get, post},
    Router,
};
use tokio::{signal, sync::broadcast};
use tower_http::{cors::CorsLayer, trace::TraceLayer};

use session::{create_session_handler, UserSession};
use uuid::Uuid;
use web_socket::{ws_handler, UserMessage};

mod session;
mod web_socket;

const FRONT_END_URL: &str = "http://localhost:3000";
const LISTENER_ADDR: &str = "127.0.0.1:3001";

struct AppState {
    users: Mutex<HashMap<String, UserSession>>,
    tx: broadcast::Sender<(Uuid, UserMessage)>,
}

pub async fn start_server() {
    let (tx, _rx) = broadcast::channel(100);
    let app_state = Arc::new(AppState {
        users: Mutex::new(HashMap::new()),
        tx,
    });

    let cors = CorsLayer::new()
        .allow_origin([FRONT_END_URL.parse().unwrap()])
        .allow_credentials(true);

    let app = Router::new()
        .route("/hello", get(|| async { "hello, you!" }))
        .route("/session", post(create_session_handler))
        .route("/ws", get(ws_handler))
        .with_state(app_state)
        .layer(cors)
        .layer(TraceLayer::new_for_http());
    let listener = tokio::net::TcpListener::bind(LISTENER_ADDR).await.unwrap();

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
