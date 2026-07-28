import { pool } from '../db/pool.js';

const fields = ['fullName', 'email', 'phone', 'location', 'linkedin', 'summary', 'jobTitle', 'company', 'startDate', 'endDate', 'achievements', 'degree', 'school', 'graduationYear', 'skills'];
const columns = ['full_name', 'email', 'phone', 'location', 'linkedin', 'summary', 'job_title', 'company', 'start_date', 'end_date', 'achievements', 'degree', 'school', 'graduation_year', 'skills'];
const valuesFor = (body) => fields.map((field) => body[field] || null);

export function saveDraft(req, res) {
  // This endpoint intentionally returns a mock response. It is useful for a fast UI save flow.
  res.status(200).json({ success: true, draftId: `draft_${Date.now()}`, message: 'Draft saved successfully (demo API).' });
}

export async function createResume(req, res, next) {
  try {
    const { fullName, email } = req.body;
    if (!fullName?.trim() || !email?.trim()) return res.status(400).json({ message: 'Full name and email are required to create a CV.' });
    const placeholders = columns.map((_, index) => `$${index + 1}`).join(', ');
    const query = `INSERT INTO resumes (${columns.join(', ')}) VALUES (${placeholders}) RETURNING id, full_name, email, created_at`;
    const { rows } = await pool.query(query, valuesFor(req.body));
    res.status(201).json({ success: true, resume: rows[0], message: 'Your CV has been created and saved to PostgreSQL.' });
  } catch (error) { next(error); }
}

export async function getResume(req, res, next) {
  try {
    const { rows } = await pool.query('SELECT * FROM resumes WHERE id = $1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ message: 'Resume not found.' });
    res.json({ success: true, resume: rows[0] });
  } catch (error) { next(error); }
}
