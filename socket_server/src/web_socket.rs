use std::{net::SocketAddr, ops::ControlFlow};

use axum::{
    extract::{
        ws::{Message, WebSocket},
        ConnectInfo, WebSocketUpgrade,
    },
    response::IntoResponse,
};
use tracing::{error, info};

pub async fn ws_handler(
    ws: WebSocketUpgrade,
    ConnectInfo(addr): ConnectInfo<SocketAddr>,
) -> impl IntoResponse {
    info!("Request for web socket fron {addr}!");
    ws.on_upgrade(move |socket| handle_socket(socket, addr))
}

async fn handle_socket(mut socket: WebSocket, who: SocketAddr) {
    while let Some(msg) = socket.recv().await {
        if let Ok(msg) = msg {
            if process_message(msg, who).is_break() {
                return;
            }
        }

        if let Err(err) = socket
            .send(Message::Text("server: I got your message.".to_string()))
            .await
        {
            error!("{err}");
        }
    }
}

fn process_message(msg: Message, who: SocketAddr) -> ControlFlow<(), ()> {
    match msg {
        Message::Text(text) => {
            println!(">>> {who} sent {text}");
        }
        Message::Close(close) => {
            if let Some(close_frame) = close {
                let code = close_frame.code;
                let reason = close_frame.reason;
                print!(">>> {who} sent close with code {code} and reason {reason}")
            } else {
                println!(">>> {who} somehow sent close message without a closeframe");
            }
            return ControlFlow::Break(());
        }
        Message::Pong(v) => {
            println!(">>> {who} sent pong with {v:?}");
        }
        _ => panic!("unsupported message type!"),
    }

    ControlFlow::Continue(())
}
