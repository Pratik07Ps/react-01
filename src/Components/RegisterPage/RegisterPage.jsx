import React, { useState } from 'react';
import './RegisterPage.css';

const RegisterPage = ({ onRegister, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false); // State for loading
  const [error, setError] = useState(null); // State to display error messages

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    setError(null); // Reset error state
    setLoading(true); // Set loading state to true

    try {
      const response = await fetch('http://127.0.0.1:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Registration successful!');
        onRegister(); // Navigate to login or home page
      } else {
        setError(data.message || 'Registration failed!');
      }
    } catch (error) {
      setError('An error occurred while registering. Please try again later.');
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <form onSubmit={handleSubmit}>
          <h2>Register</h2>

          {/* Error Message */}
          {error && <div className="error-message">{error}</div>}

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="switch-text">
          Already have an account?{' '}
          <a href="#" onClick={onSwitchToLogin}>
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};