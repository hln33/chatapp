#[cfg(test)]
mod tests {
    use std::future::IntoFuture;

    use axum::http::Request;
    use futures::{SinkExt, StreamExt};
    use socket_server::start_server;
    use tokio_tungstenite::{self, tungstenite};
    use tracing::level_filters::LevelFilter;
    use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt, Layer};

    const TEST_SERVER_ADDR: &str = "127.0.0.1:5001";
    const TEST_REQUEST_HOST: &str = "localhost:3000";

    fn init_logging() {
        let stdout_log = tracing_subscriber::fmt::layer()
            .pretty()
            .with_filter(LevelFilter::DEBUG);
        tracing_subscriber::registry().with(stdout_log).init();
    }

    #[tokio::test]
    async fn send_message() {
        init_logging();

        tokio::spawn(start_server(TEST_SERVER_ADDR)).into_future();
        tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;

        let request = Request::builder()
            .header("Origin", format!("http://{TEST_REQUEST_HOST}"))
            .header("Host", TEST_REQUEST_HOST)
            .header("Connection", "upgrade")
            .header("Upgrade", "websocket")
            .header("Sec-Websocket-Version", "13")
            .header("Sec-Websocket-Key", "dGhlIHNhbXBsZSBub25jZQ==")
            .uri(format!("ws://{TEST_SERVER_ADDR}/ws"))
            .body(())
            .unwrap();
        let (mut send_socket, _response) = tokio_tungstenite::connect_async(request.clone())
            .await
            .unwrap();
        let (mut recv_socket, _response) = tokio_tungstenite::connect_async(request.clone())
            .await
            .unwrap();

        let json_str = r#"{"username":"harry","text":"hello"}"#;
        send_socket
            .send(tungstenite::Message::text(json_str))
            .await
            .expect("message sending should be successful");

        let socket_msg = recv_socket
            .next()
            .await
            .expect("next item in stream should be present")
            .expect("item should be parasable");

        let text = match socket_msg {
            tungstenite::Message::Text(text) => text,
            other => panic!("Expected a text message but got {other:?}"),
        };
        assert_eq!(text, json_str);
    }
}
