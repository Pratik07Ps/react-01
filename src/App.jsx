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
  const [user, setUser] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogin = (userData) => {
    setUser(userData); // Store user data after successful login
  };

  const handleRegister = () => {
    setIsRegistering(false);
  };
  
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

  const toggleAuthMode = () => {
    setIsRegistering((prevState) => !prevState);
  };

  useEffect(() => {
    localStorage.setItem('current_theme', theme);
  }, [theme]);

  return (
    <div className={`container ${theme}`}>
      {user ? (
        <BrowserRouter>
          <Navbar theme={theme} setTheme={setTheme} onLogout={handleLogout} user={user} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </BrowserRouter>
      ) : (
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
