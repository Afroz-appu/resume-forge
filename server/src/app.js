import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import resumeRoutes from './routes/resumeRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { pool } from './db/pool.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();   // <-- THIS WAS MISSING

// Middleware
app.use(cors({ origin: '*', methods: ['GET', 'POST'] }));
app.use(express.json({ limit: '100kb' }));

// API routes (MUST come before static files)
app.get('/api/health', (req, res) => res.json({ success: true, message: 'ResumeForge API is healthy.' }));

app.get('/api/debug-db', async (req, res) => {
  try {
    const db = await pool.query('SELECT current_database()');
    const tables = await pool.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema='public'"
    );
    res.json({
      database: db.rows[0].current_database,
      tables: tables.rows.map(r => r.table_name)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use('/api/resumes', resumeRoutes);

// Serve React build (static files)
const distPath = path.join(__dirname, '../../client/dist');
app.use(express.static(distPath));

// Catch-all: serve index.html for any route not matching API
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Error handler (LAST)
app.use(errorHandler);

export default app;   // <-- MUST BE PRESENT