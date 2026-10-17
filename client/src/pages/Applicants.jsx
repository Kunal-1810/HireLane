import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { errorMessage, openResume } from '../api';

const STATUSES = ['applied', 'shortlisted', 'rejected', 'hired'];

export default function Applicants() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/applications/job/${id}`).then((r) => setData(r.data)).catch((e) => setError(errorMessage(e)));
  }, [id]);

  const changeStatus = async (appId, status) => {
    try {
      await api.patch(`/applications/${appId}/status`, { status });
      setData((d) => ({ ...d, applications: d.applications.map((a) => (a._id === appId ? { ...a, status } : a)) }));
    } catch (err) { setError(errorMessage(err)); }
  };

  if (error) return <p className="alert">{error}</p>;
  if (!data) return <p className="empty">Loading…</p>;

  return (
    <>
      <Link to="/recruiter" className="muted">Back to dashboard</Link>
      <h1>Applicants for {data.job.title}</h1>
      {data.applications.length === 0 ? (
        <p className="empty">No applications yet. Share the job link to attract candidates.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Candidate</th><th>Email</th><th>Applied on</th><th>Resume</th><th>Cover letter</th><th>Status</th></tr></thead>
            <tbody>
              {data.applications.map((a) => (
                <tr key={a._id}>
                  <td>{a.candidate.name}</td>
                  <td>{a.candidate.email}</td>
                  <td>{new Date(a.createdAt).toLocaleDateString()}</td>
                  <td><button className="link" onClick={() => openResume(a._id)}>Open PDF</button></td>
                  <td className="cover">{a.coverLetter || 'None'}</td>
                  <td>
                    <select value={a.status} onChange={(e) => changeStatus(a._id, e.target.value)}>
                      {STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
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
