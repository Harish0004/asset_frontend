import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../store/authSlice';
import { Package } from 'lucide-react';

const ROLES = [
  { value: 'EMPLOYEE', label: 'Employee' },
  { value: 'TECHNICIAN', label: 'Technician' },
  { value: 'ADMIN', label: 'Administrator' },
];

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('EMPLOYEE');
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
    setFormError('');
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'ADMIN') navigate('/admin/dashboard');
      else if (user.role === 'TECHNICIAN') navigate('/technician/dashboard');
      else if (user.role === 'EMPLOYEE') navigate('/employee/dashboard');
      else navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setFormError('Password must be at least 8 characters.');
      return;
    }

    dispatch(registerUser({ username, email, password, role }));
  };

  const displayError = formError || error;

  return (
    <div className="login-container">
      <div className="fluent-card login-card register-card">
        <div className="text-center mb-4">
          <Package size={48} className="text-primary mb-3 mx-auto" />
          <h3 className="fw-bold text-dark">Enterprise Asset Management</h3>
          <p className="text-muted">Create your account</p>
        </div>

        {displayError && <div className="alert alert-danger py-2">{displayError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="registerUsername"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              minLength={3}
              maxLength={50}
              required
            />
            <label htmlFor="registerUsername">Username</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              id="registerEmail"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="registerEmail">Email</label>
          </div>
          <div className="mb-3">
            <label htmlFor="registerRole" className="form-label text-muted small mb-1">
              Account type
            </label>
            <select
              className="form-select"
              id="registerRole"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
          <div className="form-floating mb-3">
            <input
              type="password"
              className="form-control"
              id="registerPassword"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
            />
            <label htmlFor="registerPassword">Password</label>
          </div>
          <div className="form-floating mb-4">
            <input
              type="password"
              className="form-control"
              id="registerConfirmPassword"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={8}
              required
            />
            <label htmlFor="registerConfirmPassword">Confirm password</label>
          </div>
          <button className="btn btn-primary w-100 py-2 fw-semibold mb-3" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-muted mb-0">
          Already have an account?{' '}
          <Link to="/login" className="text-decoration-none fw-semibold" style={{ color: 'var(--fluent-indigo)' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
