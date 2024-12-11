CREATE DATABASE dear_santa;

\c dear_santa;

CREATE TABLE letters (
    id SERIAL PRIMARY KEY,
    child_name VARCHAR(100) NOT NULL,
    letter_content TEXT NOT NULL,
    santa_response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 