import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { errorMessage } from '../api';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'candidate', company: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      const user = await register(form);
      navigate(user.role === 'recruiter' ? '/recruiter' : '/');
    } catch (err) {
      setError(errorMessage(err));
    } finally { setBusy(false); }
  };

  return (
    <form className="form auth" onSubmit={submit}>
      <h1>Create your account</h1>
      <div className="toggle">
        <button type="button" className={form.role === 'candidate' ? 'on' : ''} onClick={() => setForm({ ...form, role: 'candidate' })}>I am looking for a job</button>
        <button type="button" className={form.role === 'recruiter' ? 'on' : ''} onClick={() => setForm({ ...form, role: 'recruiter' })}>I am hiring</button>
      </div>
      <label>Full name<input required value={form.name} onChange={set('name')} /></label>
      {form.role === 'recruiter' && <label>Company name<input required value={form.company} onChange={set('company')} /></label>}
      <label>Email<input type="email" required value={form.email} onChange={set('email')} /></label>
      <label>Password (at least 6 characters)<input type="password" minLength="6" required value={form.password} onChange={set('password')} /></label>
      {error && <p className="alert">{error}</p>}
      <button className="btn" disabled={busy}>{busy ? 'Creating account…' : 'Create account'}</button>
      <p className="muted">Already registered? <Link to="/login">Log in</Link></p>
    </form>
  );
}
