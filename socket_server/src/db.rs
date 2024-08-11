use rusqlite::Connection;
use tracing::error;

use crate::login::User;

const DB_PATH: &str = "../databse.db3";

fn init_db(conn: &Connection) {
    if let Err(e) = conn.execute(
        "CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL
            )",
        (),
    ) {
        panic!("Failed to init db table: {}", e)
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

pub fn add_user(username: &str, password: &str) {
    let conn = open_db_conn();

    if let Err(e) = conn.execute(
        "INSERT INTO users (name, password) VALUES (?1, ?2) ",
        [username, password],
    ) {
        error!("Failed to insert user into db table: {}", e);
    }
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

pub fn verify_user(username: &str, session_id: &str) -> bool {
    // stub
    false
}
