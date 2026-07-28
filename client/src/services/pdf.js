import { jsPDF } from 'jspdf';

const clean = (value, fallback = '') => value?.trim() || fallback;
const wrap = (doc, text, width) => doc.splitTextToSize(clean(text), width);

export function downloadResumePdf(form) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const margin = 18;
  const width = 174;
  let y = 22;
  const line = () => { doc.setDrawColor(233, 104, 53); doc.setLineWidth(0.8); doc.line(margin, y, 192, y); y += 8; };
  const section = (title) => { if (y > 265) { doc.addPage(); y = 22; } doc.setTextColor(233, 104, 53); doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.text(title.toUpperCase(), margin, y); y += 6; doc.setTextColor(38, 52, 72); };
  const paragraph = (text) => { doc.setFont('helvetica', 'normal'); doc.setFontSize(10); const lines = wrap(doc, text, width); doc.text(lines, margin, y); y += lines.length * 5 + 5; };

  doc.setTextColor(22, 36, 59);
  doc.setFont('times', 'bold'); doc.setFontSize(25); doc.text(clean(form.fullName, 'Your Name'), margin, y); y += 8;
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(82, 97, 116);
  doc.text([form.email, form.phone, form.location].filter(Boolean).join('  |  '), margin, y); y += 5;
  if (form.linkedin) { doc.text(form.linkedin, margin, y); y += 5; }
  y += 3; line();
  section('Profile'); paragraph(form.summary || 'Professional profile');
  section('Experience');
  doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.text([form.jobTitle, form.company].filter(Boolean).join(' — ') || 'Professional experience', margin, y); y += 5;
  doc.setFont('helvetica', 'italic'); doc.setFontSize(9); doc.setTextColor(82, 97, 116); doc.text([form.startDate, form.endDate].filter(Boolean).join(' – '), margin, y); y += 6; doc.setTextColor(38, 52, 72);
  paragraph(form.achievements || '');
  section('Education'); doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.text(clean(form.degree, 'Education'), margin, y); y += 5; paragraph([form.school, form.graduationYear].filter(Boolean).join(' | '));
  section('Skills'); paragraph(form.skills || '');
  const safeName = clean(form.fullName, 'resume').replace(/[^a-z0-9]/gi, '-').toLowerCase();
  doc.save(`${safeName}-resume.pdf`);
}
