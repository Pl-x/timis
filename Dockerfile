# Build stage
FROM rust:1.83-bookworm AS builder
WORKDIR /app
COPY backend/Cargo.toml backend/Cargo.lock ./
COPY backend/crates ./crates
RUN cargo build --release --bin timis-api --bin timis-worker

# Runtime stage
FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*
COPY --from=builder /app/target/release/timis-api /usr/local/bin/
COPY --from=builder /app/target/release/timis-worker /usr/local/bin/
EXPOSE 8080
CMD ["timis-api"]
