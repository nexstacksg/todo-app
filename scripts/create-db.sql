-- Create database and user for todo-app
-- Run on PostgreSQL server
-- NOTE: Replace <SECURE_PASSWORD> with actual password from secrets

-- Create user (use password from environment/secrets!)
CREATE USER todo_user WITH PASSWORD '<SECURE_PASSWORD>';

-- Create database
CREATE DATABASE todo_db OWNER todo_user;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE todo_db TO todo_user;

\c todo_db

CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO todo_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO todo_user;
