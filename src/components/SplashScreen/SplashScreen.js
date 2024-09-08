import React, { useEffect, useState } from 'react';
import './SplashScreen.css';

const SplashScreen = ({ onLoadComplete }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true); // Start fading out
    }, 3000); // Adjust this duration for splash screen visibility

    const completeTimeout = setTimeout(() => {
      onLoadComplete(); // Remove splash screen after fade out completes
    }, 4000); // Delay based on fade out duration (e.g., 1s after fade starts)

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimeout);
    };
  }, [onLoadComplete]);

  return (
    <div className={`splash-screen ${fadeOut ? 'fade-out' : ''}`}>
      <div className="splash-content">
        <h1 className="glitch">Welcome to JRK's Portfolio</h1>
      </div>
    </div>
  );
};

export default SplashScreen;
