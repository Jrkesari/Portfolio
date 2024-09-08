import React from 'react';
import { motion } from 'framer-motion';
import './WorkExperience.css';

const workExperiences = [
  {
    time: 'Jul 2024 - Present',
    title: 'Web Developer Intern',
    company: 'Tech Freedom Online',
    location: 'Noida, Uttar Pradesh, India · (Remote)',
    description: 'Design and implement front-end and back-end solutions, optimizing performance and enhancing user interactions.',
    skills: ['Web Development', 'Front-End Development']
  },
  {
    time: 'Sep 2023 - Aug 2024',
    title: 'Visual Poet (Photography Head)',
    company: 'GeeksforGeeks Society - Bennett University',
    location: 'Greater Noida',
    description: 'Captured and showcased club events through striking photography, blending creativity and technical skills.',
    skills: ['Photography', 'Event Photography']
  },
  {
    time: 'Sep 2023 - Aug 2024',
    title: 'Co Head Multimedia',
    company: 'Google Developer Student Clubs @ BU',
    location: 'Greater Noida',
    description: 'Led multimedia projects, creating visual content and managing creative initiatives for the club.',
    skills: ['Photography', 'Team Management', 'Event Management']
  },
  {
    time: 'Sep 2023 - Aug 2024',
    title: 'Sports Photographer',
    company: 'Sports Committee, Bennett University',
    location: 'Greater Noida',
    description: 'Photographed sports events, capturing key moments and team spirit.',
    skills: ['Photography', 'Sports Photography']
  },
  {
    time: 'Feb 2024 - Apr 2024',
    title: 'Head of Multimedia',
    company: 'Bennett Undergraduate Research Society',
    location: 'Greater Noida',
    description: 'Managed multimedia for RESCON, overseeing video and social media content for a major research conference.',
    skills: ['Team Leadership', 'Event Management']
  },
  {
    time: 'Mar 2024',
    title: 'Videographer @Uphoria Fest',
    company: 'Bennett University',
    location: 'Greater Noida',
    description: 'Covered live event updates, including photos, videos, and interviews at Uphoria Fest.',
    skills: ['Videography', 'Photography']
  }
];
const typingEffect = {
  hidden: { width: 0 },
  visible: {
    width: "100%",
    transition: {
      duration: 2,
      ease: "easeInOut" // Changed to a supported easing function
    }
  }
};

const WorkExperience = () => {
  return (
    <div className="terminal-container">
      <div className="terminal-window">
        <motion.h1
          className="terminal-heading"
          initial="hidden"
          animate="visible"
          variants={typingEffect}
        >
          C:\Experience / Responsibilities
        </motion.h1>

        <div className="terminal-output">
          <table className="work-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Title</th>
                <th>Company</th>
                <th>Location</th>
                <th>Description</th>
                <th>Skills</th>
              </tr>
            </thead>
            <tbody>
              {workExperiences.map((exp, index) => (
                <tr key={index}>
                  <td>{exp.time}</td>
                  <td>{exp.title}</td>
                  <td>{exp.company || '-'}</td>
                  <td>{exp.location || '-'}</td>
                  <td>{exp.description}</td>
                  <td>{exp.skills.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WorkExperience;
