CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(180) UNIQUE NOT NULL,
    attendance_percent NUMERIC(5,2) DEFAULT 0,
    engagement_score NUMERIC(5,2) DEFAULT 0,
    assignments_completed INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS classroom_activity (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL,
    value NUMERIC(8,2) DEFAULT 0,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_activity_recorded_at
ON classroom_activity(recorded_at);

CREATE INDEX IF NOT EXISTS idx_activity_student
ON classroom_activity(student_id);
