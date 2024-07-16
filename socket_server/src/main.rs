use std::net::SocketAddr;

use axum::{routing::get, Router};

use tokio::signal;
use tower_http::cors::CorsLayer;

use socket_server::ws_handler;

#[tokio::main]
async fn main() {
    println!("Starting web socket server...");

    let app = Router::new()
        .route("/hello", get(|| async { "hello, you!" }))
        .route("/ws", get(ws_handler))
        .layer(CorsLayer::permissive());

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

    println!("ending web socket server...")
}

async fn shutdown_signal() {
    let ctrl_c = async {
        signal::ctrl_c().await.unwrap();
    };

    tokio::select! {
        _ = ctrl_c => { println!("ctrl+c detected...") },
    }
}
