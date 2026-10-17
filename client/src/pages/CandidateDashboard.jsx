import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errorMessage, openResume } from '../api';

export default function CandidateDashboard() {
  const [apps, setApps] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/applications/mine').then((r) => setApps(r.data.applications)).catch((e) => setError(errorMessage(e)));
  }, []);

  if (error) return <p className="alert">{error}</p>;
  if (!apps) return <p className="empty">Loading…</p>;

  return (
    <>
      <h1>My applications</h1>
      {apps.length === 0 ? (
        <p className="empty">You have not applied to any jobs yet. <Link to="/">Browse open jobs</Link></p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Job</th><th>Company</th><th>Applied on</th><th>Resume</th><th>Status</th></tr></thead>
            <tbody>
              {apps.map((a) => (
                <tr key={a._id}>
                  <td>{a.job ? <Link to={`/jobs/${a.job._id}`}>{a.job.title}</Link> : 'Job removed'}</td>
                  <td>{a.job?.company}</td>
                  <td>{new Date(a.createdAt).toLocaleDateString()}</td>
                  <td><button className="link" onClick={() => openResume(a._id)}>View</button></td>
                  <td><span className={`status ${a.status}`}>{a.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
