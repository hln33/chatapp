use std::{net::SocketAddr, ops::ControlFlow, sync::Arc};

use axum::{
    extract::{
        ws::{Message, WebSocket},
        ConnectInfo, State, WebSocketUpgrade,
    },
    response::IntoResponse,
};
use futures::{stream::StreamExt, SinkExt};
use tracing::info;

use crate::AppState;

pub async fn ws_handler(
    ws: WebSocketUpgrade,
    ConnectInfo(addr): ConnectInfo<SocketAddr>,
    State(state): State<Arc<AppState>>,
) -> impl IntoResponse {
    info!("Request for web socket fron {addr}!");
    ws.on_upgrade(move |socket| handle_socket(socket, addr, state))
}

async fn handle_socket(socket: WebSocket, who: SocketAddr, state: Arc<AppState>) {
    let (mut sender, mut reciever) = socket.split();

    // listen for broadcast messages and relay the message to this socket
    let mut rx = state.tx.subscribe();
    let mut _send_task = tokio::spawn(async move {
        while let Ok(msg) = rx.recv().await {
            if sender.send(Message::Text(msg)).await.is_err() {
                break;
            }
        }
    });

    // take message from this socket and broadcast to all subscribers
    let tx = state.tx.clone();
    let mut _recv_task = tokio::spawn(async move {
        while let Some(Ok(Message::Text(msg))) = reciever.next().await {
            let _ = tx.send(msg);
        }
    });
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
