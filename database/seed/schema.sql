-- Maseno Counseling Bot Database Schema
-- Complete schema with all working components

CREATE TABLE IF NOT EXISTS counselors (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT false,
  phone VARCHAR(20),
  specialization TEXT,
  bio TEXT,
  office_location TEXT,
  office_hours TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS students (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  admission_no TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  year_of_study INT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS appointments (
  id SERIAL PRIMARY KEY,
  student_id INT REFERENCES students(id) ON DELETE CASCADE,
  counselor_id INT REFERENCES counselors(id) ON DELETE CASCADE,
  start_ts TIMESTAMP NOT NULL,
  end_ts TIMESTAMP NOT NULL,
  status TEXT DEFAULT "pending", -- pending | confirmed | canceled
  telegram_user_id BIGINT,
  telegram_username TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS announcements (
  id SERIAL PRIMARY KEY,
  counselor_id INT REFERENCES counselors(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  title TEXT,
  priority TEXT DEFAULT "normal", -- low, normal, high, urgent
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now()
);

-- Triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language "plpgsql";

-- Apply triggers
DROP TRIGGER IF EXISTS update_appointments_updated_at ON appointments;
CREATE TRIGGER update_appointments_updated_at
BEFORE UPDATE ON appointments
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_counselors_updated_at ON counselors;
CREATE TRIGGER update_counselors_updated_at
BEFORE UPDATE ON counselors
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_counselors_email ON counselors(email);
CREATE INDEX IF NOT EXISTS idx_students_admission_no ON students(admission_no);
CREATE INDEX IF NOT EXISTS idx_appointments_student_id ON appointments(student_id);
CREATE INDEX IF NOT EXISTS idx_appointments_counselor_id ON appointments(counselor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_start_ts ON appointments(start_ts);
