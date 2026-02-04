-- Create database and user for todo-app
-- Run on PostgreSQL server (15.235.196.21)

-- Create user (change password!)
CREATE USER todo_user WITH PASSWORD 'changeme';

-- Create database
CREATE DATABASE todo_db OWNER todo_user;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE todo_db TO todo_user;

-- Connect to the database and create tables
\c todo_db

-- Todos table
CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Grant table privileges
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO todo_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO todo_user;
