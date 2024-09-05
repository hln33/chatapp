FROM rust:1.80

WORKDIR /app
COPY Cargo.toml Cargo.lock ./
COPY . .
RUN cargo build --release

EXPOSE 3000
CMD ./target/release/web_server
