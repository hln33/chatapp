use std::{net::SocketAddr, sync::Arc};

use axum::{
    extract::{
        ws::{Message, WebSocket},
        ConnectInfo, State, WebSocketUpgrade,
    },
    response::IntoResponse,
};
use futures::{stream::StreamExt, SinkExt};
use serde::{Deserialize, Serialize};
use tracing::{error, info};
use uuid::Uuid;

use crate::AppState;

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct UserMessage {
    username: String,
    text: String,
    image_urls: Vec<String>,
}

pub async fn handler(
    ws: WebSocketUpgrade,
    ConnectInfo(addr): ConnectInfo<SocketAddr>,
    State(state): State<Arc<AppState>>,
) -> impl IntoResponse {
    info!("Request for web socket fron {addr}!");
    ws.on_upgrade(move |socket| handle_socket(socket, state))
}

async fn handle_socket(socket: WebSocket, state: Arc<AppState>) {
    let client_id = Uuid::new_v4();
    let (mut sender, mut reciever) = socket.split();

    // listen for broadcast messages and relay the message to this socket
    let mut rx = state.tx.subscribe();
    let mut _send_task = tokio::spawn(async move {
        while let Ok((sender_id, msg)) = rx.recv().await {
            if sender_id == client_id {
                continue;
            }

            let json_string = serde_json::to_string(&msg).expect("struct to serializable");
            if sender.send(Message::Text(json_string)).await.is_err() {
                break;
            }
        }
    });

    // take message from this socket and broadcast to all subscribers
    let tx = state.tx.clone();
    let mut _recv_task = tokio::spawn(async move {
        while let Some(Ok(Message::Text(msg))) = reciever.next().await {
            if let Some(json_msg) = parse_json(&msg) {
                let _ = tx.send((client_id, json_msg));
            }
        }
    });
}

fn parse_json(msg: &str) -> Option<UserMessage> {
    match serde_json::from_str::<UserMessage>(msg) {
        Ok(payload) => Some(payload),
        Err(e) => {
            error!("Failed to parse message: {e}");
            None
        }
    }
}

// fn process_message(msg: Message, who: SocketAddr) -> ControlFlow<(), ()> {
//     match msg {
//         Message::Text(text) => {
//             println!(">>> {who} sent {text}");
//         }
//         Message::Close(close) => {
//             if let Some(close_frame) = close {
//                 let code = close_frame.code;
//                 let reason = close_frame.reason;
//                 print!(">>> {who} sent close with code {code} and reason {reason}")
//             } else {
//                 println!(">>> {who} somehow sent close message without a closeframe");
//             }
//             return ControlFlow::Break(());
//         }
//         Message::Pong(v) => {
//             println!(">>> {who} sent pong with {v:?}");
//         }
//         _ => panic!("unsupported message type!"),
//     }

//     ControlFlow::Continue(())
// }
