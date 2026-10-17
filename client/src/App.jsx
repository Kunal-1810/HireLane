import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import JobDetails from './pages/JobDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import CandidateDashboard from './pages/CandidateDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import JobForm from './pages/JobForm';
import Applicants from './pages/Applicants';

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/my-applications" element={<ProtectedRoute role="candidate"><CandidateDashboard /></ProtectedRoute>} />

          <Route path="/recruiter" element={<ProtectedRoute role="recruiter"><RecruiterDashboard /></ProtectedRoute>} />
          <Route path="/recruiter/jobs/new" element={<ProtectedRoute role="recruiter"><JobForm /></ProtectedRoute>} />
          <Route path="/recruiter/jobs/:id/edit" element={<ProtectedRoute role="recruiter"><JobForm /></ProtectedRoute>} />
          <Route path="/recruiter/jobs/:id/applicants" element={<ProtectedRoute role="recruiter"><Applicants /></ProtectedRoute>} />

          <Route path="*" element={<p className="empty">This page does not exist.</p>} />
        </Routes>
      </main>
    </>
  );
}
