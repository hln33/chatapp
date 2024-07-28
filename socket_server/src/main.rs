use tracing::{info, level_filters::LevelFilter};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt, Layer};

use socket_server::start_server;

const LISTENER_ADDR: &str = "127.0.0.1:3001";

#[tokio::main]
async fn main() {
    init_logging();
    info!("Starting web socket server...");

    start_server(LISTENER_ADDR).await;

    info!("ending web socket server...")
}

fn init_logging() {
    let stdout_log = tracing_subscriber::fmt::layer()
        .pretty()
        .with_filter(LevelFilter::DEBUG);
    tracing_subscriber::registry().with(stdout_log).init();
}
