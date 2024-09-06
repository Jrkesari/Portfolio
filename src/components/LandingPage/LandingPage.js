import React from 'react';
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

function TextOverlay() {
  return (
    <div className="text-overlay">
      <h1>What I am/do,</h1>
    </div>
  );
}

function TextOverlay2() {
  return (
    <div className="text-overlay2">
      <h1>Web Developer</h1>
    </div>
  );
}

function TextOverlay3() {
  return (
    <div className="text-overlay3">
      <h1>Data Science</h1>
    </div>
  );
}

function TextOverlay4() {
  return (
    <div className="text-overlay4">
      <h1>Data Analyst</h1>
    </div>
  );
}

function LandingPage() {
  return (
    <div className="landing-page">
      <div className="model-container">
        <TextOverlay />
        <TextOverlay3 />
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
        <TextOverlay4 />
        <TextOverlay2 />
      </div>
    </div>
  );
}

export default LandingPage;
