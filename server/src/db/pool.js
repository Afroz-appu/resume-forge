import pg from 'pg';

const { Pool } = pg;
const isProduction = process.env.NODE_ENV === 'production';
// Local development can use individual variables so special characters in a
// password do not need URL encoding. Render uses DATABASE_URL in production.
const localConfig = process.env.DB_PASSWORD ? {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || 'resumeforge',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD
} : { connectionString: process.env.DATABASE_URL };

export const pool = new Pool({ ...localConfig, ssl: isProduction ? { rejectUnauthorized: false } : false });
