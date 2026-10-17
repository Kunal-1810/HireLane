import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({ baseURL: `${API_URL}/api` });

// Attach the JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const errorMessage = (err) => err.response?.data?.message || 'Something went wrong. Please try again.';

export default api;

// Resume PDFs need the login token, so fetch them with axios and open the result in a new tab
export async function openResume(applicationId) {
  const win = window.open('', '_blank');
  try {
    const res = await api.get(`/applications/${applicationId}/resume`, { responseType: 'blob' });
    const url = URL.createObjectURL(res.data);
    if (win) win.location.href = url;
    else window.open(url, '_blank');
  } catch (err) {
    if (win) win.close();
    alert(errorMessage(err));
  }
}
