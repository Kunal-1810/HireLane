import { useEffect, useState } from 'react';
import api, { errorMessage } from '../api';
import JobCard from '../components/JobCard';

const TYPES = ['Full-time', 'Part-time', 'Internship', 'Contract', 'Remote'];

export default function Home() {
  const [filters, setFilters] = useState({ q: '', location: '', type: '', minSalary: '' });
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ jobs: [], total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchJobs = async (f = filters, p = page) => {
    setLoading(true);
    setError('');
    try {
      const params = { ...f, page: p };
      Object.keys(params).forEach((k) => !params[k] && delete params[k]);
      const res = await api.get('/jobs', { params });
      setData(res.data);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); /* eslint-disable-next-line */ }, [page]);

  const onChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });
  const onSearch = (e) => { e.preventDefault(); setPage(1); fetchJobs(filters, 1); };

  return (
    <>
      <section className="hero">
        <h1>Find work you can start on Monday.</h1>
        <p className="muted">Search open roles, upload your resume, and track every application in one place.</p>
        <form className="search" onSubmit={onSearch}>
          <input name="q" value={filters.q} onChange={onChange} placeholder="Job title, skill or company" />
          <input name="location" value={filters.location} onChange={onChange} placeholder="City or remote" />
          <button className="btn" type="submit">Search jobs</button>
        </form>
        <div className="filters">
          <select name="type" value={filters.type} onChange={onChange} onBlur={onSearch}>
            <option value="">All job types</option>
            {TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
          <select name="minSalary" value={filters.minSalary} onChange={onChange} onBlur={onSearch}>
            <option value="">Any salary</option>
            <option value="300000">₹3L+ a year</option>
            <option value="500000">₹5L+ a year</option>
            <option value="800000">₹8L+ a year</option>
          </select>
          <button className="btn btn-ghost" type="button" onClick={() => {
            const reset = { q: '', location: '', type: '', minSalary: '' };
            setFilters(reset); setPage(1); fetchJobs(reset, 1);
          }}>Clear filters</button>
        </div>
      </section>

      {error && <p className="alert">{error}</p>}
      {loading ? <p className="empty">Loading jobs…</p> : data.jobs.length === 0 ? (
        <p className="empty">No jobs match your search. Try a different keyword or clear the filters.</p>
      ) : (
        <>
          <p className="muted result-count">{data.total} open {data.total === 1 ? 'job' : 'jobs'}</p>
          <div className="grid">{data.jobs.map((job) => <JobCard key={job._id} job={job} />)}</div>
          {data.pages > 1 && (
            <div className="pager">
              <button className="btn btn-ghost" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
              <span>Page {page} of {data.pages}</span>
              <button className="btn btn-ghost" disabled={page >= data.pages} onClick={() => setPage(page + 1)}>Next</button>
            </div>
          )}
        </>
      )}
    </>
  );
}
