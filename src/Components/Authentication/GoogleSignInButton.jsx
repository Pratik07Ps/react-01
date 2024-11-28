import React from 'react';
import { auth, googleProvider, signInWithPopup } from './firebaseConfig.js';
import googleLogo from '../../assets/google-logo.png'; // Ensure you have this image file in your project.

const GoogleSignInButton = ({ onLogin }) => {
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      onLogin(user);

      // Optional: Save to backend
      const response = await fetch('http://127.0.0.1:5000/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          name: user.displayName,
          uid: user.uid,
        }),
      });

      const data = await response.json();
      if (data.success) {
        onLogin(user); // Pass the user data to parent component
      } else {
        alert('Failed to sign in via Google backend!');
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error.message);
      alert("Failed to sign in with Google. Try again later.");
    }
  };

  return (
    <div style={containerStyle}>
    <button onClick={handleGoogleSignIn} style={buttonStyle}>
      <img src={googleLogo} alt="Google Logo" style={logoStyle} />
      Sign in with Google
    </button>
    </div>
  );
};

const containerStyle = {
  display: 'flex',
  justifyContent: 'center', // Center horizontally
  alignItems: 'center', // Center vertically
};

const buttonStyle = {
  background: 'transparent',
  color: 'black',
  padding: '10px 20px',
  border: '2px solid black',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '16px',
  display: 'flex', // Ensure the text and logo align horizontally
  alignItems: 'center', // Center-align text and logo
  gap: '10px', // Add spacing between the logo and text
};

const logoStyle = {
  width: '20px',
  height: '20px',
};

export default GoogleSignInButton;
