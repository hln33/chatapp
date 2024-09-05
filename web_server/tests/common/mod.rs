use std::future::IntoFuture;

use tracing::level_filters::LevelFilter;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt, Layer};
use web_server::start_server;

pub const TEST_SERVER_ADDR: &str = "127.0.0.1:5001";

fn init_logging() {
    let stdout_log = tracing_subscriber::fmt::layer()
        .pretty()
        .with_filter(LevelFilter::DEBUG);
    tracing_subscriber::registry().with(stdout_log).init();
}

pub async fn start_test_server() {
    init_logging();
    tokio::spawn(start_server(TEST_SERVER_ADDR)).into_future();
    tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
}
