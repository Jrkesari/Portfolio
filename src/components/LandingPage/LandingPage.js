import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, PerspectiveCamera } from '@react-three/drei';
import './LandingPage.css';

function Model() {
  const { scene } = useGLTF('/models/commodore_64__computer_full_pack.glb');
  return (
    <mesh scale={[1, 1, 1]}>
      <primitive object={scene} />
    </mesh>
  );
}

function TextOverlay({ className, text }) {
  return (
    <div className={className}>
      <h1>{text}</h1>
    </div>
  );
}

function LandingPage() {
  const modelContainerRef = useRef(null);

  // 3D effect on hover
  const handleMouseMove = (e) => {
    const container = modelContainerRef.current;
    const xAxis = (window.innerWidth / 2 - e.pageX) / 50;  // Adjust for sensitivity
    const yAxis = (window.innerHeight / 2 - e.pageY) / 50; // Adjust for sensitivity
    container.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
  };

  const handleMouseLeave = () => {
    modelContainerRef.current.style.transform = `rotateY(0deg) rotateX(0deg)`; // Reset position
  };

  return (
    <div className="landing-page" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <div className="model-container" ref={modelContainerRef}>
        <TextOverlay className="text-overlay" text="What I am/do," />
        <TextOverlay className="text-overlay3" text="Data Science" />
        <Canvas className="canvas">
          <PerspectiveCamera makeDefault position={[0, 2, 5]} fov={75} />
          <OrbitControls
            minDistance={10}
            maxDistance={12}
            enableZoom={true}
            enablePan={false}
            enableRotate={true}
          />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <Model />
        </Canvas>
        <TextOverlay className="text-overlay4" text="Data Analyst" />
        <TextOverlay className="text-overlay2" text="Web Developer" />
      </div>
    </div>
  );
}

export default LandingPage;
