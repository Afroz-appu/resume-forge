CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(50),
  location VARCHAR(120),
  linkedin VARCHAR(255),
  summary TEXT,
  job_title VARCHAR(120),
  company VARCHAR(120),
  start_date VARCHAR(50),
  end_date VARCHAR(50),
  achievements TEXT,
  degree VARCHAR(150),
  school VARCHAR(150),
  graduation_year VARCHAR(10),
  skills TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
