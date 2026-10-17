import { Link } from 'react-router-dom';

export const formatSalary = (min, max) => {
  if (!min && !max) return 'Salary not disclosed';
  const lpa = (n) => `₹${(n / 100000).toFixed(1).replace('.0', '')}L`;
  return `${lpa(min)} – ${lpa(max)} a year`;
};

export default function JobCard({ job }) {
  return (
    <Link to={`/jobs/${job._id}`} className="job-card">
      <div className="job-card-head">
        <h3>{job.title}</h3>
        <span className="chip">{job.type}</span>
      </div>
      <p className="muted">{job.company} · {job.location}</p>
      <p className="salary">{formatSalary(job.salaryMin, job.salaryMax)}</p>
      <div className="skills">
        {job.skills?.slice(0, 4).map((s) => <span key={s} className="skill">{s}</span>)}
      </div>
    </Link>
  );
}
