const API_URL = 'https://resume-forge-sg2u.onrender.com/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options
  });

  const body = await response.json();
  if (!response.ok) throw new Error(body.message || 'Something went wrong.');
  return body;
}

export const resumeApi = {
  saveDraft: (data) => request('/resumes/draft', { method: 'POST', body: JSON.stringify(data) }),
  create: (data) => request('/resumes', { method: 'POST', body: JSON.stringify(data) })
};