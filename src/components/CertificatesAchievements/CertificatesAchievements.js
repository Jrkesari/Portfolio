import React, { useState } from 'react';
import './CertificatesAchievements.css';

// Sample data with certificate and achievement image links
const certificates = [
  {
    title: 'British Airways - Data Science Job Simulation',
    description: 'Issued by Forage in Aug 2024',
    imgSrc: 'british.png',
  },
  {
    title: 'AWS Academy Graduate - AWS Academy Cloud Architecting',
    description: 'Issued by Amazon Web Services in Dec 2023',
    imgSrc: 'awscloud2.png',
  },
  {
    title: 'AWS Academy Graduate - AWS Academy Cloud Foundations',
    description: 'Issued by Amazon Web Services in Oct 2023',
    imgSrc: 'awscloud.png',
  },
  {
    title: 'AWS Academy Graduate - AWS Academy Data Engineering',
    description: 'Issued by Amazon Web Services in Oct 2023',
    imgSrc: 'awsdata.png',
  },
  {
    title: 'Linux Fundamentals',
    description: 'Issued by Coursera in Aug 2023',
    imgSrc: 'linux.png',
  },
];


const achievements = [
  {
    title: 'Academic Excellence Award Semester 1',
    description: 'Earned a perfect 10 CGPA in the first semester at Bennett University',
    imgSrc: 'sem1.jpeg',
  },
  {
    title: 'Academic Excellence Award Semester 2',
    description: 'Earned a 9.83 CGPA in the second semester at Bennett University',
    imgSrc: '/Sem3.jpg',
  },
  {
    title: 'Academic Excellence Award Semester 3',
    description: 'Earned a 9.72 CGPA in the third semester at Bennett University',
    imgSrc: '/Sem2.jpg',
  },
];

function CertificatesAchievements() {
  const [selectedImage, setSelectedImage] = useState(null); // State to track the clicked image

  // Function to open the modal with the selected image
  const handleImageClick = (imgSrc) => {
    setSelectedImage(imgSrc);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="certificates-achievements-container">
      <div className="column certificates">
        <h2 className="section-title">Certificates</h2>
        {certificates.map((certificate, index) => (
          <div className="certificate-item" key={index}>
            <img
              src={certificate.imgSrc}
              alt={certificate.title}
              className="certificate-img"
              onClick={() => handleImageClick(certificate.imgSrc)} // Show modal on click
            />
            <h3>{certificate.title}</h3>
            <p>{certificate.description}</p>
          </div>
        ))}
      </div>

      <div className="column achievements">
        <h2 className="section-title">Achievements</h2>
        {achievements.map((achievement, index) => (
          <div className="achievement-item" key={index}>
            <img
              src={achievement.imgSrc}
              alt={achievement.title}
              className="achievement-img"
              onClick={() => handleImageClick(achievement.imgSrc)} // Show modal on click
            />
            <h3>{achievement.title}</h3>
            <p>{achievement.description}</p>
          </div>
        ))}
      </div>

      {/* Modal for showing the enlarged image */}
      {selectedImage && (
        <div className="modal" onClick={handleCloseModal}>
          <span className="close-modal">&times;</span>
          <img className="modal-content" src={selectedImage} alt="Achievement or Certificate" />
        </div>
      )}
    </div>
  );
}

export default CertificatesAchievements;
