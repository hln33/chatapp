use std::{net::SocketAddr, sync::Arc};

use axum::{
    extract::{
        ws::{Message, WebSocket},
        ConnectInfo, State, WebSocketUpgrade,
    },
    response::IntoResponse,
};
use futures::{
    stream::{SplitSink, StreamExt},
    SinkExt,
};
use serde::{Deserialize, Serialize};
use tokio::sync::broadcast::{Receiver, Sender};
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
    fn spawn_broadcast_listener_task(
        client_id: Uuid,
        mut broadcast_rx: Receiver<(Uuid, UserMessage)>,
        mut sender: SplitSink<WebSocket, Message>,
    ) {
        let _task = tokio::spawn(async move {
            while let Ok((sender_id, msg)) = broadcast_rx.recv().await {
                if sender_id == client_id {
                    continue;
                }

                let json_string = serde_json::to_string(&msg).expect("struct to serializable");
                if sender.send(Message::Text(json_string)).await.is_err() {
                    break;
                }
            }
        });
    }

    fn spawn_broadcast_sender_task(
        client_id: Uuid,
        broadcast_tx: Sender<(Uuid, UserMessage)>,
        mut reciever: futures::stream::SplitStream<WebSocket>,
    ) {
        let _task = tokio::spawn(async move {
            while let Some(Ok(Message::Text(msg))) = reciever.next().await {
                if let Some(json_msg) = parse_json(&msg) {
                    let _ = broadcast_tx.send((client_id, json_msg));
                }
            }
        });
    }

    let client_id = Uuid::new_v4();
    let (sender, reciever) = socket.split();

    let rx = state.tx.subscribe();
    spawn_broadcast_listener_task(client_id, rx, sender);

    let tx = state.tx.clone();
    spawn_broadcast_sender_task(client_id, tx, reciever);
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
