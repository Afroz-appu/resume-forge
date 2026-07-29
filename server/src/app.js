import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import resumeRoutes from './routes/resumeRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// FIX: CORS syntax error (was missing closing quote)
app.use(cors({ 
  origin: process.env.CLIENT_URL?.split(',') || '*', 
  methods: ['GET', 'POST'] 
}));

app.use(express.json({ limit: '100kb' }));
app.get('/api/health', (req, res) => res.json({ success: true, message: 'ResumeForge API is healthy.' }));
app.use('/api/resumes', resumeRoutes);

// ===== NEW: Serve React build =====
const distPath = path.join(__dirname, '../../client/dist');
app.use(express.static(distPath));

// Catch-all: serve index.html for any route not matching API
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});
app.get('/api/db-check', async (req, res) => {
  try {
    const result = await pool.query('SELECT current_database()');
    res.json({ database: result.rows[0].current_database });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ===================================

app.use(errorHandler);
export default app;