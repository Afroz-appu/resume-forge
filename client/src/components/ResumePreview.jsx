import React from 'react';

export default function ResumePreview({ form }) {
  const skills = form.skills.split(',').map((skill) => skill.trim()).filter(Boolean);
  return <article className="resume-paper">
    <header className="resume-header">
      <h2>{form.fullName || 'Your Name'}</h2>
      <p>{[form.email, form.phone, form.location].filter(Boolean).join('  ·  ') || 'email@example.com · +91 00000 00000'}</p>
      {form.linkedin && <a href={form.linkedin} target="_blank">{form.linkedin}</a>}
    </header>
    <section><h3>Profile</h3><p>{form.summary || 'A clear, concise professional profile will appear here.'}</p></section>
    <section><h3>Experience</h3><h4>{form.jobTitle || 'Job Title'} {form.company && `— ${form.company}`}</h4><small>{form.startDate || 'Start date'} – {form.endDate || 'Present'}</small><p>{form.achievements || 'Add measurable achievements that show your impact.'}</p></section>
    <section><h3>Education</h3><h4>{form.degree || 'Degree / Qualification'}</h4><p>{[form.school, form.graduationYear].filter(Boolean).join(' · ')}</p></section>
    <section><h3>Skills</h3><div className="skill-list">{(skills.length ? skills : ['Communication', 'Problem solving', 'Leadership']).map((skill) => <span key={skill}>{skill}</span>)}</div></section>
  </article>;
}
