import React from 'react';
import { motion } from 'framer-motion';
import './WorkExperience.css';

const workExperiences = [
  {
    time: 'Jul 2024 - Present',
    title: 'Web Developer Intern',
    company: 'Tech Freedom Online',
    location: 'Noida, Uttar Pradesh, India · Remote',
    description: 'I actively contribute to the design and implementation of front-end and back-end solutions, focusing on optimizing performance and enhancing user interactions. This internship allows me to apply my web development skills in a real-world setting, develop innovative solutions, and gain valuable industry experience.',
    skills: ['Web Development', 'Front-End Development']
  },
  {
    time: 'Sep 2023 - Aug 2024',
    title: 'Visual Poet (Photography Head)',
    company: 'GeeksforGeeks Society - Bennett University',
    description: 'As Geeks for Geeks Club\'s Visual Poet (Photography Head), I blended words and imagery to craft compelling visual tales. My role was to capture the essence of club events, translating our community\'s energy into striking photos. I curated a visual journey, highlighting creativity and knowledge-sharing. This experience enhanced my technical skills, letting me experiment with various styles and evoke emotions through photos.',
    skills: ['Photography', 'Event Photography']
  },
  {
    time: 'Sep 2023 - Aug 2024',
    title: 'Co Head Multimedia',
    company: 'Google Developer Student Clubs @ BU',
    location: 'Greater Noida',
    description: 'I\'m the Multimedia Co-Head at GDSC Club, passionate about crafting captivating visual stories and innovative multimedia content. I lead our club\'s creative initiatives, capturing moments and weaving them into immersive narratives. Join me in exploring boundless possibilities in multimedia expression at GDSC Club. Let\'s bring ideas to life and create meaningful connections together!',
    skills: ['Photography', 'Team Management', 'Management', 'Event Management', 'Operations Management']
  },
  {
    time: 'Sep 2023 - Aug 2024',
    title: 'Sports Photographer',
    company: 'Sports Committee, Bennett University',
    description: 'Captured dynamic moments during sports events, highlighting athletic achievements and team spirit.',
    skills: ['Photography', 'Sports Photography', 'Event Photography']
  },
  {
    time: 'Feb 2024 - Apr 2024',
    title: 'Head of Multimedia',
    company: 'Bennett Undergraduate Research Society',
    description: 'Led the multimedia team for BURS Research Conference (RESCON), a flagship event of BURS at Bennett University. Successfully managed a team responsible for multimedia responsibilities, such as video photography and social media management. The event was a resounding success, fostering a vibrant research environment.',
    skills: ['Team Leadership', 'Team Management', 'Event Management', 'Event Photography']
  },
  {
    time: 'Mar 2024',
    title: 'Videographer @Uphoria Fest',
    company: 'Bennett University',
    description: 'Secured the opportunity to cover Bennett University\'s Uphoria Fest, a major campus event, by providing live social media updates, capturing photos and videos, and interviewing performers and attendees. This experience fostered my communication and content creation skills, while also allowing me to network with event organizers and fellow students. It was an honor to interact with established names in the industry, like Singer Shaan and the Nalayak Band.',
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
          Experience / Responsibilities
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
