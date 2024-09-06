import React from 'react';
import ProjectCard from './ProjectCard';
import './Project.css'; // Import the CSS file
import { motion } from 'framer-motion';

const projects = [
  {
    title: 'Airline Review Analysis',
    details: 'Analyzed airline reviews with Python, including sentiment analysis and visual insights. Summary provided actionable feedback for improving airline services.',
    repoUrl: 'https://github.com/your-repo/Airline-Review-Analysis'
  },
  {
    title: 'E-Commerce Website (Front-end) using ReactJS',
    details: 'Developed a dynamic e-commerce site with ReactJS, featuring interactive elements, responsive design with Bootstrap, and smooth animations with Framer Motion.',
    repoUrl: 'https://github.com/your-repo/E-Commerce-Website-ReactJS'
  },
  {
    title: 'AiReviewHub Developed using Spring Boot Framework',
    details: 'Created AiReviewHub, a review platform tailored for AI enthusiasts, featuring categorized reviews for various AI websites.',
    repoUrl: 'https://github.com/Jrkesari/AiReviewHub'
  },
  {
    title: 'India World Development GDP Analysis',
    details: 'Explored factors influencing India\'s GDP growth by analyzing various economic indicators and their correlations.',
    repoUrl: 'https://github.com/Jrkesari/India-World-Development-GDP-Analysis'
  },
  {
    title: 'Job Matching for Decent Work and Economic Growth (WorkWise)',
    details: 'Built a job matching platform connecting job seekers with meaningful opportunities while promoting decent work and economic growth.',
    repoUrl: 'https://github.com/Jrkesari/workwise'
  },
  {
    title: 'School Management System',
    details: 'Developed a basic School Management System using PHP, HTML, CSS, and MySQL for my first college project.',
    repoUrl: 'https://github.com/Jrkesari/School-Management-System'
  }
];



const Projects = () => {
  return (
    <div className="terminal-container">
      <div className="terminal-window">
      <motion.h1
          className="terminal-heading"
          initial="hidden"
          animate="visible"
          // variants={typingEffect}
        >
          C:\Projects
        </motion.h1>

      <ul className="projects-list">
        {projects.map((project, index) => (
          <li key={index}>
            <ProjectCard
              title={project.title}
              details={project.details}
              repoUrl={project.repoUrl}
            />
          </li>
        ))}
      </ul>
    </div>
    </div>
    
  );
};

export default Projects;
