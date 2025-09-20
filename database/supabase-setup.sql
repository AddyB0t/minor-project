-- Smart Agriculture App - Supabase Database Setup
-- Run these commands in your Supabase dashboard SQL editor
-- NO RLS (Row Level Security) policies - public access

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    joined_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Plants database
CREATE TABLE plants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    water_need TEXT CHECK(water_need IN ('low', 'medium', 'high')),
    sunlight TEXT CHECK(sunlight IN ('low', 'medium', 'high')),
    soil_ph REAL,
    cost_per_acre INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Sensor readings
CREATE TABLE sensors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    sensor_type TEXT NOT NULL,
    value REAL NOT NULL,
    reading_date TIMESTAMP DEFAULT NOW()
);

-- Chat history
CREATE TABLE chats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    user_message TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    chat_date TIMESTAMP DEFAULT NOW()
);

-- Insert sample plant data
INSERT INTO plants (name, water_need, sunlight, soil_ph, cost_per_acre) VALUES
('Tomato', 'high', 'high', 6.5, 800),
('Wheat', 'medium', 'high', 7.0, 300),
('Rice', 'high', 'medium', 6.0, 500),
('Corn', 'medium', 'high', 6.8, 400),
('Potato', 'medium', 'medium', 6.0, 600);

-- Insert sample user for testing
INSERT INTO users (name, email) VALUES
('Farmer John', 'john@farm.com');

-- NO RLS policies - tables are publicly accessible
-- This allows your app to read/write without authentication