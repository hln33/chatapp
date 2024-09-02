use std::time::{SystemTime, UNIX_EPOCH};

use rusqlite::{Connection, Result};
use tracing::{error, info};

use crate::routes::login::User;

const DB_PATH: &str = "./databse.db3";

fn init_db(conn: &Connection) {
    let tables = [
        (
            "users",
            "CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL
            )",
        ),
        (
            "sessions",
            "CREATE TABLE IF NOT EXISTS sessions (
                session_id TEXT PRIMARY KEY,
                user_id INTEGER NOT NULL UNIQUE,
                expiration_time INTEGER,
                FOREIGN KEY(user_id) REFERENCES users(id)
            )",
        ),
    ];

    for (table_name, creation_query) in tables {
        if let Err(e) = conn.execute(creation_query, []) {
            panic!("Failed to init {} table: {}", table_name, e);
        }
    }
}

fn open_db_conn() -> Connection {
    match Connection::open(DB_PATH) {
        Ok(conn) => {
            init_db(&conn);
            conn
        }
        Err(e) => panic!("failed to open db connection: {}", e),
    }
}

pub fn add_user(username: &str, password: &str) -> Result<(), String> {
    let conn = open_db_conn();

    if get_user(username).is_some() {
        return Err(String::from("Username already exists"));
    }

    if let Err(e) = conn.execute(
        "INSERT INTO users (name, password) VALUES (?1, ?2) ",
        [username, password],
    ) {
        error!("Failed to insert user into db table: {}", e);
        return Err(String::from("Server Error"));
    }
    Ok(())
}

pub fn get_user(username: &str) -> Option<User> {
    let conn = open_db_conn();

    let mut stmt = conn
        .prepare("SELECT id, name, password FROM users WHERE name = ?1")
        .expect("db statement should be valid");
    let mut rows = stmt
        .query_map([username], |row| {
            Ok(User {
                username: row.get(1)?,
                password: row.get(2)?,
            })
        })
        .expect("parameter binding should not fail");

    rows.next().map(|user| user.unwrap())
}

pub fn create_session(username: &str, session_id: &str) -> Result<()> {
    let conn = open_db_conn();

    let mut stmt = conn
        .prepare("SELECT id FROM users WHERE name = ?1")
        .unwrap();
    let user_id: i32 = stmt.query_row([username], |row| row.get(0)).unwrap();

    let expiration_time = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs()
        + 3600; // 1 hour from now

    conn.execute(
        "INSERT OR REPLACE INTO sessions (session_id, user_id, expiration_time) VALUES (?1, ?2, ?3)",
        [
            session_id,
            &user_id.to_string(),
            &expiration_time.to_string(),
        ],
    )
    .unwrap();

    info!("Created new user session.");
    Ok(())
}

pub fn verify_user_session(session_id: &str) -> Result<bool> {
    let conn = open_db_conn();

    let mut stmt = conn.prepare("SELECT expiration_time FROM sessions WHERE session_id = ?1")?;
    let session_expire_time: u64 = stmt.query_row([session_id], |row| row.get(0))?;

    let current_time = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs();
    if current_time > session_expire_time {
        conn.execute("DELETE FROM sessions WHERE session_id = ?1", [session_id])?;
        Ok(false)
    } else {
        Ok(true)
    }
}
