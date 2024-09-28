import React, { useRef, useState } from 'react'; // Import useRef and useState
import { Helmet } from 'react-helmet'; // Import react-helmet
import LandingPage from './components/LandingPage/LandingPage';
import WorkExperience from './components/WorkExp/WorkExperience';
import Projects from './components/Project/Project';
import CertificatesAchievements from './components/CertificatesAchievements/CertificatesAchievements';
import ContactMe from './components/ContactFooter/ContactFooter';
import SplashScreen from './components/SplashScreen/SplashScreen';
import SkillsPage from './components/Skills/Skills';
import './App.css';

function App() {
  const [loading, setLoading] = useState(true);

  const handleLoadComplete = () => {
    setLoading(false);
  };

  // Create references for each section
  const homeRef = useRef(null);
  const experienceRef = useRef(null);
  const projectsRef = useRef(null);
  const certificatesRef = useRef(null);
  const contactRef = useRef(null);
  const skillsRef = useRef(null);

  // Scroll to a section
  const handleScroll = (sectionRef) => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Google Meta Verification Tag */}
      <Helmet>
        <meta name="google-site-verification" content="ly8PBtmKNZ95cBeX3kSWmRMTXStc_3tAyoveMVcAkAE" />
        <title>JRK's Portfolio</title>
      </Helmet>

      {loading && <SplashScreen onLoadComplete={handleLoadComplete} />}
      {!loading && (
        <div>
          {/* Navbar */}
          <div className="navbar">
            <span onClick={() => handleScroll(homeRef)} className="logo">JRK's Portfolio</span>
            <div className="nav-links">
              <span onClick={() => handleScroll(homeRef)} className="blinking-cursor">Home</span>
              <span onClick={() => handleScroll(experienceRef)} className="blinking-cursor">Experience</span>
              <span onClick={() => handleScroll(skillsRef)} className="blinking-cursor">Skills</span>
              <span onClick={() => handleScroll(projectsRef)} className="blinking-cursor">Projects</span>
              <span onClick={() => handleScroll(certificatesRef)} className="blinking-cursor">Certificates</span>
              <span onClick={() => handleScroll(contactRef)} className="blinking-cursor">Contact</span>
              <a href="resume.pdf" download className="resume-button">Resume</a> {/* Resume download button */}
            </div>
          </div>

          {/* Sections */}
          <div className="section" id="home" ref={homeRef}>
            <LandingPage />
          </div>

          <div className="section" id="experience" ref={experienceRef}>
            <WorkExperience />
          </div>

          <div className="section" id="skills" ref={skillsRef}>
            <SkillsPage />
          </div>

          <div className="section" id="projects" ref={projectsRef}>
            <Projects />
          </div>

          <div className="section" id="certificates" ref={certificatesRef}>
            <CertificatesAchievements />
          </div>

          <div className="section" id="contact" ref={contactRef}>
            <ContactMe />
          </div>
        </div>
      )}
    </>
  );
}

export default App;
