import { pool } from '../db/pool.js';

const fields = ['fullName', 'email', 'phone', 'location', 'linkedin', 'summary', 'jobTitle', 'company', 'startDate', 'endDate', 'achievements', 'body'];
const valuesFor = (body) => fields.map((field) => body[field] || null);
const formatDate = (date) => {
    if (!date || date === "Present") return null;

    // Already in YYYY-MM-DD format
    if (date.includes("-")) return date;

    // Convert DD/MM/YYYY to YYYY-MM-DD
    const [day, month, year] = date.split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

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
        const formattedStartDate = formatDate(startDate);
        const formattedEndDate = formatDate(endDate);
        const today = new Date();
today.setHours(0, 0, 0, 0);

// Validate start date
if (formattedStartDate) {
    const start = new Date(formattedStartDate);

    if (start > today) {
        return res.status(400).json({
            message: 'Start date cannot be in the future.'
        });
    }
}

// Validate end date
if (formattedEndDate) {
    const end = new Date(formattedEndDate);

    if (end > today) {
        return res.status(400).json({
            message: 'End date cannot be in the future.'
        });
    }
}

// Validate that end date is not before start date
if (formattedStartDate && formattedEndDate) {
    const start = new Date(formattedStartDate);
    const end = new Date(formattedEndDate);

    if (end < start) {
        return res.status(400).json({
            message: 'End date cannot be earlier than start date.'
        });
    }
}

// Check if end date is in the future
if (formattedEndDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const end = new Date(formattedEndDate);

    if (end > today) {
        return res.status(400).json({
            message: 'End date cannot be in the future.'
        });
    }
}

        const columns = ['full_name', 'email', 'phone', 'location', 'linkedin', 'summary', 'job_title', 'company', 'start_date', 'end_date', 'achievements', 'body'];
        const values = [
            fullName,
            email,
            phone,
            location,
            linkedin,
            summary,
            jobTitle,
            company,
            formattedStartDate,
            formattedEndDate,
            achievements,
             body
    ];
        const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

       const query = `INSERT INTO resumes (${columns.join(', ')}) VALUES (${placeholders}) RETURNING id, full_name, email`;
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