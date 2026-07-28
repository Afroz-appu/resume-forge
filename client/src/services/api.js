const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

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
