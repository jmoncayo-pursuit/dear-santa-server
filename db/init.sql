-- Drop database if it exists
DROP DATABASE IF EXISTS dear_santa;

-- Create database
CREATE DATABASE dear_santa;

-- Connect to the database
\c dear_santa;

-- Create letters table
CREATE TABLE letters (
    id SERIAL PRIMARY KEY,
    child_name VARCHAR(100) NOT NULL,
    letter_content TEXT NOT NULL,
    santa_response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 