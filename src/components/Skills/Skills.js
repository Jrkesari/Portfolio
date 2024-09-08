import React from 'react';
import { motion } from 'framer-motion';
import './Skills.css';

const skills = [
  { name: "Python", icon: "/python.png" },
  { name: "Java", icon: "/java.png" },
  { name: "SQL", icon: "/sql.png" },
  { name: "AWS (EC2, S3)", icon: "/aws.png" },
  { name: "HTML", icon: "/html.png" },
  { name: "CSS", icon: "/css.png" },
  { name: "React JS", icon: "/react.png" },
  { name: "Power BI", icon: "/powerbi.png" },
  { name: "MongoDB", icon: "/mongodb.png" },
  { name: "Beautiful Soup", icon: "/beautifulsoup.png" }
];

const SkillsPage = () => {
  return (
    <div className="terminal-container">
      <div className="terminal-window">
        <motion.h1
          className="terminal-heading"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, ease: "easeInOut" }}
        >
          C:\Skills
        </motion.h1>
        <div className="terminal-output"></div>
        <div className="skills-page">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              className="skill"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.1 }}
            >
              <img src={skill.icon} alt={skill.name} className="skill-icon" />
              <p className="skill-name">{skill.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsPage;
