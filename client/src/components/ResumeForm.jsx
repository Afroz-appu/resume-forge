import React from 'react';

const groups = [
  ['Personal details', [['fullName', 'Full name', 'text'], ['email', 'Email address', 'email'], ['phone', 'Phone number', 'tel'], ['location', 'City, Country', 'text'], ['linkedin', 'LinkedIn URL', 'url']]],
  ['Professional summary', [['summary', 'Write 2–3 compelling lines about yourself', 'textarea']]],
  ['Experience', [['jobTitle', 'Most recent job title', 'text'], ['company', 'Company name', 'text'], ['startDate', 'Start date', 'text'], ['endDate', 'End date (or Present)', 'text'], ['achievements', 'Key achievements', 'textarea']]],
  ['Education & skills', [['degree', 'Degree / qualification', 'text'], ['school', 'School / university', 'text'], ['graduationYear', 'Graduation year', 'text'], ['skills', 'Skills (separate with commas)', 'text']]]
];

export default function ResumeForm({ form, onChange }) {
  return <div>{groups.map(([title, fields]) => <section className="form-section" key={title}><h2>{title}</h2><div className="field-grid">{fields.map(([name, label, type]) => <label key={name} className={type === 'textarea' ? 'wide' : ''}>{label}{type === 'textarea' ? <textarea name={name} value={form[name]} onChange={onChange} placeholder={label} rows="4" /> : <input name={name} type={type} value={form[name]} onChange={onChange} placeholder={label} />}</label>)}</div></section>)}</div>;
}
