import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, MeshWobbleMaterial, Sphere } from "@react-three/drei";

const DroppingSphere = () => {
  const ref = useRef();
  useFrame(({ clock }) => {
    ref.current.position.y = Math.sin(clock.getElapsedTime() * 1.5) * 0.3;
  });
  return (
    <Sphere ref={ref} args={[1.5, 64, 64]}>
      <MeshWobbleMaterial 
        color="#F0F8FF" 
        emissive="#BFDFFF" 
        emissiveIntensity={0.3} 
        attach="material" 
        factor={0.3} 
        speed={0.4} 
        roughness={0.15} 
        metalness={0.05} 
      />
    </Sphere>
  );
};

const ThreeDBackground = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden">
      <Canvas camera={{ position: [0, 0, 3] }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[3, 3, 3]} intensity={0.8} />
        <Suspense fallback={null}>
          <DroppingSphere />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} />
      </Canvas>
    </div>
  );
};

export default ThreeDBackground;