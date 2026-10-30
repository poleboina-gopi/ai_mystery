import axios from 'axios';

// Auto-normalize API base URL to prevent endpoint mismatch
let rawBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').trim();
rawBaseUrl = rawBaseUrl.replace(/\/+$/, '');
const API_BASE_URL = rawBaseUrl.endsWith('/api') ? rawBaseUrl : `${rawBaseUrl}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

export async function createCase({ premise, difficulty }) {
  const response = await api.post('/cases', { premise, difficulty });
  return response.data;
}

export async function getCase(id) {
  const response = await api.get(`/cases/${id}`);
  return response.data;
}

export async function discoverClue(caseId, clueId) {
  const response = await api.post(`/cases/${caseId}/clues/${clueId}/discover`);
  return response.data;
}

export async function requestHint(caseId) {
  const response = await api.post(`/cases/${caseId}/hints`);
  return response.data;
}

export async function submitAccusation(caseId, { suspectId, deduction }) {
  const response = await api.post(`/cases/${caseId}/accuse`, { suspectId, deduction });
  return response.data;
}

export async function getCaseResult(caseId) {
  const response = await api.get(`/cases/${caseId}/result`);
  return response.data;
}

export async function listRecentCases() {
  const response = await api.get('/cases');
  return response.data;
}

export default api;
