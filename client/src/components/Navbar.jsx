import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from "../assets/hirelane-logo.svg";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link to="/" className="brand"> 
      <img src={logo} alt="HireLane" className="logo" /></Link>
        <nav className="nav-links">
          <NavLink to="/" end>Jobs</NavLink>
          {user?.role === 'candidate' && <NavLink to="/my-applications">My applications</NavLink>}
          {user?.role === 'recruiter' && <NavLink to="/recruiter">Recruiter dashboard</NavLink>}
          {user ? (
            <>
              <span className="nav-user">{user.name}</span>
              <button className="btn btn-ghost" onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
              <NavLink to="/login">Log in</NavLink>
              <Link to="/register" className="btn">Sign up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
