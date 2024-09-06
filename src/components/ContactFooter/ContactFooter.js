import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import './ContactFooter.css'; // Import the combined CSS file

const ContactMe = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const sendEmail = (e) => {
    e.preventDefault();
    
    // Send the form data using EmailJS
    emailjs.send('service_twx8ryp', 'template_0psgytu', formData, 'gF0hKxzplZrXToImf')
      .then((result) => {
        alert('Message sent successfully!');
      }, (error) => {
        alert('Failed to send the message, please try again.');
      });
      
    // Reset the form
    setFormData({
      name: '',
      email: '',
      message: ''
    });
  };

  return (
    <div className="contact-container">
      <h2 className="contact-header">Contact Me</h2>
      <form className="contact-form" onSubmit={sendEmail}>
        <label className="contact-label">
          Name:
          <input
            type="text"
            className="contact-input"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="_"
            required
          />
        </label>
        <label className="contact-label">
          Email:
          <input
            type="email"
            className="contact-input"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="_"
            required
          />
        </label>
        <label className="contact-label">
          Message:
          <textarea
            className="contact-textarea"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="_"
            required
          ></textarea>
        </label>
        <button type="submit" className="submit-button">
          Send Command
        </button>
      </form>
      <Footer />
    </div>
  );
};

const Footer = () => {
  return (
    <div className="footer-container">
      <p className="footer-text">© 2024 Jayesh Ranjan Kesari | All Rights Reserved</p>
      <div className="social-media-icons">
        <a href="https://github.com/Jrkesari/" className="social-icon">[GitHub]</a>
        <a href="https://x.com/me_jayeshrkesar" className="social-icon">[Twitter]</a>
        <a href="https://www.linkedin.com/in/jayesh-ranjan-kesari-2573b3252/" className="social-icon">[LinkedIn]</a>
      </div>
    </div>
  );
};

export default ContactMe;
