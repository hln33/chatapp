use axum::{
    routing::{get, post},
    Router,
};
use http::header::CONTENT_TYPE;
use std::{net::SocketAddr, sync::Arc};
use tokio::{net::ToSocketAddrs, signal, sync::broadcast};
use tower_http::{cors::CorsLayer, services::ServeDir, trace::TraceLayer};
use uuid::Uuid;

use routes::{check_session, file_upload, login, web_socket};

mod db;
mod routes;

const FRONT_END_URL: &str = "http://localhost:3000";
// const FRONT_END_URL: &str = "http://143.198.108.142";

struct AppState {
    tx: broadcast::Sender<(Uuid, web_socket::UserMessage)>,
}

fn app() -> Router {
    let (tx, _rx) = broadcast::channel(100);
    let app_state = Arc::new(AppState { tx });
    let cors = CorsLayer::new()
        .allow_origin([FRONT_END_URL.parse().unwrap()])
        .allow_headers([CONTENT_TYPE])
        .allow_credentials(true);

    Router::new()
        .route("/login", post(login::handler))
        .route("/check_session", get(check_session::handler))
        .route("/ws", get(web_socket::handler))
        .route("/file_upload", post(file_upload::handler))
        .nest_service("/uploads", ServeDir::new("public/uploads"))
        .with_state(app_state)
        .layer(cors)
        .layer(TraceLayer::new_for_http())
}

pub async fn start_server<T: ToSocketAddrs>(listener_addr: T) {
    // test code
    db::add_user("harry", "12345");
    let user = db::get_user("harry");
    println!("{:?}", user);
    ////////////

    axum::serve(
        tokio::net::TcpListener::bind(listener_addr).await.unwrap(),
        app().into_make_service_with_connect_info::<SocketAddr>(),
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
