import React, { useState } from 'react';
import ResumeForm from './components/ResumeForm';
import ResumePreview from './components/ResumePreview';
import { resumeApi } from './services/api';
import { downloadResumePdf } from './services/pdf';

const initialForm = { fullName: '', email: '', phone: '', location: '', linkedin: '', summary: '', jobTitle: '', company: '', startDate: '', endDate: 'Present', achievements: '', degree: '', school: '', graduationYear: '', skills: '' };

export default function App() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = async (action) => {
    setLoading(true); setStatus({ text: '', type: '' });
    try {
      const result = action === 'draft' ? await resumeApi.saveDraft(form) : await resumeApi.create(form);
      if (action === 'create') downloadResumePdf(form);
      setStatus({ text: action === 'create' ? `${result.message} Your PDF download has started.` : result.message, type: 'success' });
    }
    catch (error) { setStatus({ text: error.message, type: 'error' }); }
    finally { setLoading(false); }
  };
  return <><header className="site-header"><a className="brand" href="#top"><span>R</span> ResumeForge</a><p>Build a resume that opens doors.</p></header><main id="top"><section className="hero"><div><p className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</p><h1>Turn your story into a <em>standout</em> resume.</h1><p className="hero-copy">Complete the form, see your resume take shape live, then save it securely when you are ready.</p></div><div className="hero-stat"><strong>01</strong><span>simple builder<br />endless possibilities</span></div></section><section className="builder"><div className="editor"><div className="editor-heading"><div><p className="eyebrow">STEP 1 OF 1</p><h1>Tell us about you</h1></div><span className="required">* Required fields recommended</span></div><ResumeForm form={form} onChange={onChange} /><div className="actions"><button className="save" onClick={() => submit('draft')} disabled={loading}>{loading ? 'Working…' : 'Save draft'}</button><button className="create" onClick={() => submit('create')} disabled={loading}>{loading ? 'Creating…' : 'Create CV →'}</button></div>{status.text && <p className={`status ${status.type}`}>{status.text}</p>}</div><aside className="preview"><div className="preview-label"><span>LIVE PREVIEW</span><span className="dot">● Auto-saved locally</span></div><ResumePreview form={form} /></aside></section></main><footer>ResumeForge · Crafted for your next opportunity</footer></>;
}
