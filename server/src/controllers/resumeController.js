import { pool } from '../db/pool.js';

const fields = ['fullName', 'email', 'phone', 'location', 'linkedin', 'summary', 'jobTitle', 'company', 'startDate', 'endDate', 'achievements', 'body'];
const valuesFor = (body) => fields.map((field) => body[field] || null);

export function saveDraft(req, res) {
    res.status(200).json({ 
        success: true, 
        draftId: `draft_${Date.now()}`, 
        message: 'Draft saved successfully (demo API).' 
    });
}

export async function createResume(req, res, next) {
    try {
        const { fullName, email, phone, location, linkedin, summary, jobTitle, company, startDate, endDate, achievements, body } = req.body;
        
        if (!fullName?.trim() || !email?.trim()) {
            return res.status(400).json({ message: 'Full name and email are required.' });
        }

        const columns = ['full_name', 'email', 'phone', 'location', 'linkedin', 'summary', 'job_title', 'company', 'start_date', 'end_date', 'achievements', 'body'];
        const values = [fullName, email, phone, location, linkedin, summary, jobTitle, company, startDate, endDate, achievements, body];
        const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

        const query = `INSERT INTO resumes (${columns.join(', ')}) VALUES (${placeholders}) RETURNING id, full_name, email, created_at`;
        const { rows } = await pool.query(query, values);
        res.status(201).json({ success: true, resume: rows[0], message: 'CV created.' });
    } catch (error) {
        next(error);
    }
}
export async function getResume(req, res, next) {
    try {
        const { rows } = await pool.query('SELECT * FROM resumes WHERE id = $1', [req.params.id]);
        if (!rows[0]) return res.status(404).json({ message: 'Resume not found.' });
        res.json({ success: true, resume: rows[0] });
    } catch (error) {
        next(error);
    }
}