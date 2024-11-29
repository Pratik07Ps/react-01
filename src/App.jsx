import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import LoginPage from './Components/LoginPage/LoginPage';
import RegisterPage from './Components/RegisterPage/RegisterPage';
import Home from './Components/Home/Home';
import About from './Components/About/About';
import './App.css';

const App = () => {
  const current_theme = localStorage.getItem('current_theme');
  const [theme, setTheme] = useState(current_theme ? current_theme : 'light');
  const [user, setUser] = useState(null); // Tracks the logged-in user
  const [isRegistering, setIsRegistering] = useState(false); // Toggle between login and registration modes

  // Handle user login
  const handleLogin = (userData) => {
    setUser(userData); // Set user state upon successful login
  };

  // Handle user registration
  const handleRegister = () => {
    setIsRegistering(false); // Switch to login page after registration
  };

  // Handle user logout
  const handleLogout = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (data.success) {
        setUser(null); // Reset user state on successful logout
      } else {
        alert('Logout failed: ' + data.message);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Toggle between Login and Register pages
  const toggleAuthMode = () => {
    setIsRegistering((prevState) => !prevState);
  };

  // Persist the current theme to local storage
  useEffect(() => {
    localStorage.setItem('current_theme', theme);
  }, [theme]);

  return (
    <div className={`container ${theme}`}>
      {user ? (
        // Render the authenticated section with Navbar and Routes
        <BrowserRouter>
          <Navbar theme={theme} setTheme={setTheme} onLogout={handleLogout} user={user} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </BrowserRouter>
      ) : (
        // Render the authentication page (Login or Register)
        <div className="auth-page">
          {isRegistering ? (
            <RegisterPage onRegister={handleRegister} onSwitchToLogin={toggleAuthMode} />
          ) : (
            <LoginPage onLogin={handleLogin} onSwitchToRegister={toggleAuthMode} />
          )}
        </div>
      )}
    </div>
  );
};

export default App;
