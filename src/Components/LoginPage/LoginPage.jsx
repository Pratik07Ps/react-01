import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Authentication/firebaseConfig'; // Firebase auth instance
import GoogleSignInButton from '../Authentication/GoogleSignInButton';
import './LoginPage.css';

const LoginPage = ({ onLogin, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // Error message state

  const handleFlaskLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.success) {
        onLogin(data.user); // Call a function to handle successful login
        setErrorMessage(''); // Clear any previous error messages
      } else {
        setErrorMessage(data.message); // Set the error message if login fails
      }
    } catch (error) {
      console.error('Error during Flask login:', error);
      setErrorMessage('An error occurred with Flask login. Please try again later.');
    }
  };

  const handleFirebaseLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      onLogin(user); // Call onLogin with Firebase user object
      setErrorMessage(''); // Clear previous errors
    } catch (error) {
      console.error('Error during Firebase login:', error.message);
      setErrorMessage('Firebase login failed. Please check your credentials.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    // Use either Flask login or Firebase login based on your preference.
    // Uncomment the one you'd like to use:

    // Uncomment to use Flask-based login
    await handleFlaskLogin(e);

    // Uncomment to use Firebase email/password login
    //await handleFirebaseLogin(e);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <form onSubmit={handleLogin}>
          <h2>Login</h2>
          {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Error message display */}
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
          <button type="submit">Login</button>
        </form>

        <p className="switch-text">
          Don’t have an account?{' '}
          <a href="#" onClick={onSwitchToRegister}>
            Create one
          </a>
        </p>

        <div>
          <br />
          -----------------------------OR------------------------------
          <br />
        </div>

        <div style={{ margin: '10px 0' }}>
          <GoogleSignInButton onLogin={onLogin} /> {/* Google Sign-In Button */}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
