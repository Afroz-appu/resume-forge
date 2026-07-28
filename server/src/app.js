import express from 'express';
import cors from 'cors';
import resumeRoutes from './routes/resumeRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL?.split(',') || '*', methods: ['GET', 'POST'] }));
app.use(express.json({ limit: '100kb' }));
app.get('/api/health', (req, res) => res.json({ success: true, message: 'ResumeForge API is healthy.' }));
app.use('/api/resumes', resumeRoutes);
app.use(errorHandler);
export default app;
