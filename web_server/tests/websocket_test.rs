mod common;

#[cfg(test)]
mod tests {
    use crate::common;
    use axum::http::Request;
    use futures::{SinkExt, StreamExt};
    use tokio_tungstenite::{self, tungstenite};

    const TEST_SERVER_ADDR: &str = "127.0.0.1:5001";
    const TEST_REQUEST_HOST: &str = "localhost:3000";

    #[tokio::test]
    async fn send_message() {
        common::start_test_server().await;

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

        let json_str = r#"{"username":"harry","text":"hello","image_urls":[]}"#;
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
