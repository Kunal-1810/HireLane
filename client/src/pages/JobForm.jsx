import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { errorMessage } from '../api';

const empty = { title: '', location: '', type: 'Full-time', salaryMin: '', salaryMax: '', experience: 'Fresher', skills: '', description: '' };

export default function JobForm() {
  const { id } = useParams(); // present when editing
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!id) return;
    api.get(`/jobs/${id}`).then((r) => setForm({ ...r.data.job, skills: r.data.job.skills.join(', ') }))
      .catch((e) => setError(errorMessage(e)));
  }, [id]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      const body = { ...form, salaryMin: Number(form.salaryMin) || 0, salaryMax: Number(form.salaryMax) || 0 };
      id ? await api.put(`/jobs/${id}`, body) : await api.post('/jobs', body);
      navigate('/recruiter');
    } catch (err) {
      setError(errorMessage(err));
    } finally { setBusy(false); }
  };

  return (
    <form className="form" onSubmit={submit}>
      <h1>{id ? 'Edit job' : 'Post a job'}</h1>
      <label>Job title<input required value={form.title} onChange={set('title')} /></label>
      <div className="two">
        <label>Location<input required value={form.location} onChange={set('location')} /></label>
        <label>Job type
          <select value={form.type} onChange={set('type')}>
            {['Full-time', 'Part-time', 'Internship', 'Contract', 'Remote'].map((t) => <option key={t}>{t}</option>)}
          </select>
        </label>
      </div>
      <div className="two">
        <label>Minimum salary (₹ a year)<input type="number" min="0" value={form.salaryMin} onChange={set('salaryMin')} /></label>
        <label>Maximum salary (₹ a year)<input type="number" min="0" value={form.salaryMax} onChange={set('salaryMax')} /></label>
      </div>
      <label>Experience required<input value={form.experience} onChange={set('experience')} /></label>
      <label>Skills (separate with commas)<input value={form.skills} onChange={set('skills')} placeholder="React, Node.js, MongoDB" /></label>
      <label>Job description<textarea required rows="8" value={form.description} onChange={set('description')} /></label>
      {error && <p className="alert">{error}</p>}
      <button className="btn" disabled={busy}>{busy ? 'Saving…' : id ? 'Save changes' : 'Publish job'}</button>
    </form>
  );
}
