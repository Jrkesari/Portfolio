// SplashScreen.js
import React, { useEffect } from 'react';
import './SplashScreen.css';

const SplashScreen = ({ onLoadComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onLoadComplete();
    }, 1000); // Adjust the time as needed

    return () => clearTimeout(timer);
  }, [onLoadComplete]);

  return (
    <div className="splash-screen">
      <div className="splash-content">
        <h1 className="glitch">Welcome to My Portfolio</h1>
      </div>
    </div>
  );
};

export default SplashScreen;
