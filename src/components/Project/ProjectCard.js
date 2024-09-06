import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './ProjectCard.css'; // Import the CSS file

const ProjectCard = ({ title, details, repoUrl }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    
    <div className="project-card-container">
      <motion.div
        className="project-card"
        initial={{ rotateY: 0 }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        onClick={() => setIsFlipped(!isFlipped)}
        style={{ cursor: 'pointer' }} // Change cursor to pointer
      >
        <div className="front">
          <span>C:\</span> {title}
        </div>
        <div className="back">
          <p>{details}</p>
          <a href={repoUrl} className="repo-button" target="_blank" rel="noopener noreferrer">
            View on GitHub
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default ProjectCard;
