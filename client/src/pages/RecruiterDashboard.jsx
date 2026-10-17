import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errorMessage } from '../api';

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState(null);
  const [error, setError] = useState('');

  const load = () => api.get('/jobs/mine/list').then((r) => setJobs(r.data.jobs)).catch((e) => setError(errorMessage(e)));
  useEffect(() => { load(); }, []);

  const toggleStatus = async (job) => {
    await api.put(`/jobs/${job._id}`, { status: job.status === 'open' ? 'closed' : 'open' });
    load();
  };

  const remove = async (job) => {
    if (!window.confirm(`Delete "${job.title}" and all its applications?`)) return;
    await api.delete(`/jobs/${job._id}`);
    load();
  };

  if (error) return <p className="alert">{error}</p>;
  if (!jobs) return <p className="empty">Loading…</p>;

  return (
    <>
      <div className="row-between">
        <h1>Your job postings</h1>
        <Link to="/recruiter/jobs/new" className="btn">Post a job</Link>
      </div>
      {jobs.length === 0 ? (
        <p className="empty">You have not posted any jobs yet. Post your first job to start receiving applications.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Title</th><th>Location</th><th>Applicants</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {jobs.map((j) => (
                <tr key={j._id}>
                  <td>{j.title}</td>
                  <td>{j.location}</td>
                  <td><Link to={`/recruiter/jobs/${j._id}/applicants`}>{j.applicants} applicants</Link></td>
                  <td><span className={`status ${j.status}`}>{j.status}</span></td>
                  <td className="actions">
                    <Link to={`/recruiter/jobs/${j._id}/edit`}>Edit</Link>
                    <button className="link" onClick={() => toggleStatus(j)}>{j.status === 'open' ? 'Close' : 'Reopen'}</button>
                    <button className="link danger" onClick={() => remove(j)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
