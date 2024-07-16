use std::net::SocketAddr;

use axum::extract::ws::{Message, WebSocket, WebSocketUpgrade};
use axum::extract::ConnectInfo;
use axum::response::IntoResponse;
use axum::{routing::get, Router};

use tokio::signal;
use tower_http::cors::CorsLayer;
use tower_http::trace::{DefaultMakeSpan, TraceLayer};

#[tokio::main]
async fn main() {
    println!("Starting web socket server...");

    let app = Router::new()
        .route("/hello", get(|| async { "hello, you!" }))
        .route("/ws", get(ws_handler))
        .layer(CorsLayer::permissive())
        .layer(
            TraceLayer::new_for_http()
                .make_span_with(DefaultMakeSpan::default().include_headers(true)),
        );

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

async fn ws_handler(
    ws: WebSocketUpgrade,
    ConnectInfo(addr): ConnectInfo<SocketAddr>,
) -> impl IntoResponse {
    println!("Request for web socket fron {addr}!");
    ws.on_upgrade(handle_socket)
}

async fn handle_socket(mut socket: WebSocket) {
    if socket.send(Message::Ping(vec![1, 2, 3])).await.is_ok() {
        // println!("Pinged {who}...");
    } else {
        // println!("could not ping {who}!");
    }

    while let Some(msg) = socket.recv().await {
        let msg = msg.unwrap().into_text().unwrap();
        println!("message: {msg}");
    }
}

async fn shutdown_signal() {
    let ctrl_c = async {
        signal::ctrl_c().await.unwrap();
    };

    tokio::select! {
        _ = ctrl_c => {println!("ctrl+c detected...")},
    }
}
