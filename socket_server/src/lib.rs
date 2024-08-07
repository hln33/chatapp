use axum::{
    routing::{get, post},
    Router,
};
use file_upload::file_upload_handler;
use http::header::CONTENT_TYPE;
use login::{login_handler, User};
use std::{
    collections::HashMap,
    net::SocketAddr,
    sync::{Arc, Mutex},
};
use tokio::{net::ToSocketAddrs, signal, sync::broadcast};
use tower_http::{cors::CorsLayer, services::ServeDir, trace::TraceLayer};
use uuid::Uuid;
use web_socket::{ws_handler, UserMessage};

mod file_upload;
mod login;
mod web_socket;

const FRONT_END_URL: &str = "http://localhost:3000";

struct AppState {
    users: Mutex<HashMap<String, User>>,
    tx: broadcast::Sender<(Uuid, UserMessage)>,
}

fn create_user_db() -> Mutex<HashMap<String, User>> {
    let mut users = HashMap::new();
    users.insert(
        "harry".to_string(),
        User {
            username: "harry".to_string(),
            password: "harryiscool".to_string(),
        },
    );
    Mutex::new(users)
}

async fn shutdown_signal() {
    let ctrl_c = async {
        signal::ctrl_c().await.unwrap();
    };

    tokio::select! {
        _ = ctrl_c => { println!("ctrl+c detected...") },
    }
}

fn app() -> Router {
    let (tx, _rx) = broadcast::channel(100);
    let app_state = Arc::new(AppState {
        users: create_user_db(),
        tx,
    });

    let cors = CorsLayer::new()
        .allow_origin([FRONT_END_URL.parse().unwrap()])
        .allow_headers([CONTENT_TYPE])
        .allow_credentials(true);

    Router::new()
        .route("/login", post(login_handler))
        .route("/ws", get(ws_handler))
        .route("/file_upload", post(file_upload_handler))
        .nest_service("/uploads", ServeDir::new("public/uploads"))
        .with_state(app_state)
        .layer(cors)
        .layer(TraceLayer::new_for_http())
}

pub async fn start_server<T: ToSocketAddrs>(listener_addr: T) {
    let app = app();
    let listener = tokio::net::TcpListener::bind(listener_addr).await.unwrap();

    axum::serve(
        listener,
        app.into_make_service_with_connect_info::<SocketAddr>(),
    )
    .with_graceful_shutdown(shutdown_signal())
    .await
    .unwrap();
}
