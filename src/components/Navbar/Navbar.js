// src/components/Navbar.js
import React from 'react';
import './Navbar.css'; // Import the CSS file

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item"><a href="#home" className="navbar-link">Home</a></li>
        <li className="navbar-item"><a href="#experience" className="navbar-link">Experience</a></li>
        <li className="navbar-item"><a href="#projects" className="navbar-link">Projects</a></li>
        <li className="navbar-item"><a href="#certificates" className="navbar-link">Certificates</a></li>
        <li className="navbar-item"><a href="#contact" className="navbar-link">Contact</a></li>
        <li className="navbar-item"><a href="#skills" className="navbar-link">Skills</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
