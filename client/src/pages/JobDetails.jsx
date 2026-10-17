import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { errorMessage } from '../api';
import { useAuth } from '../context/AuthContext';
import { formatSalary } from '../components/JobCard';

export default function JobDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [error, setError] = useState('');
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    api.get(`/jobs/${id}`).then((r) => setJob(r.data.job)).catch((e) => setError(errorMessage(e)));
  }, [id]);

  const apply = async (e) => {
    e.preventDefault();
    setError('');
    if (!resume) return setError('Please attach your resume as a PDF.');
    const form = new FormData();
    form.append('resume', resume);
    form.append('coverLetter', coverLetter);
    setSubmitting(true);
    try {
      await api.post(`/applications/${id}`, form);
      setApplied(true);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (!job) return error ? <p className="alert">{error}</p> : <p className="empty">Loading…</p>;

  return (
    <div className="detail">
      <Link to="/" className="muted">Back to all jobs</Link>
      <h1>{job.title}</h1>
      <p className="muted">{job.company} · {job.location} · {job.type}</p>
      <p className="salary">{formatSalary(job.salaryMin, job.salaryMax)}</p>
      <p className="muted">Experience: {job.experience}</p>
      <div className="skills">{job.skills.map((s) => <span key={s} className="skill">{s}</span>)}</div>

      <h2>About the role</h2>
      <p className="prewrap">{job.description}</p>

      <div className="panel">
        <h2>Apply for this job</h2>
        {job.status === 'closed' ? (
          <p className="muted">This job is closed and no longer accepts applications.</p>
        ) : !user ? (
          <p><Link to="/login">Log in</Link> or <Link to="/register">create a candidate account</Link> to apply.</p>
        ) : user.role !== 'candidate' ? (
          <p className="muted">Recruiter accounts cannot apply to jobs.</p>
        ) : applied ? (
          <p className="success">Application sent. Track it under <Link to="/my-applications">My applications</Link>.</p>
        ) : (
          <form onSubmit={apply} className="form">
            <label>Resume (PDF, up to 2 MB)
              <input type="file" accept="application/pdf" onChange={(e) => setResume(e.target.files[0])} />
            </label>
            <label>Cover letter (optional)
              <textarea rows="4" value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} />
            </label>
            {error && <p className="alert">{error}</p>}
            <button className="btn" disabled={submitting}>{submitting ? 'Sending…' : 'Send application'}</button>
          </form>
        )}
      </div>
    </div>
  );
}
