use axum::{routing::get, Router};
use tower_http::cors::CorsLayer;

#[tokio::main]
async fn main() {
    println!("Starting web socket server...");

    let app = Router::new()
        .route("/", get(|| async { "hello, world!" }))
        .layer(CorsLayer::permissive());
    let listener = tokio::net::TcpListener::bind("0.0.0:1433").await.unwrap();
    axum::serve(listener, app).await.unwrap();

    println!("ending web socket server...");
}
