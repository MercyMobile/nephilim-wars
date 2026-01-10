import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

// Animated fire component
function Fire({ position }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.scale.x = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.15;
      meshRef.current.scale.z = 1 + Math.cos(state.clock.elapsedTime * 2) * 0.15;
      meshRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[15, 16, 16]} />
        <meshBasicMaterial color="#ff6b00" transparent opacity={0.8} />
      </mesh>
      <pointLight color="#ff6b00" intensity={2} distance={100} />
    </group>
  );
}

// Main tabernacle structure
function TabernacleStructure() {
  return (
    <>
      {/* Ground - sand colored */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[500, 250]} />
        <meshStandardMaterial color="#d6d3d1" />
      </mesh>

      {/* === COURTYARD WALLS === */}
      {/* North wall (back) */}
      <mesh position={[0, 12.5, -125]} castShadow>
        <planeGeometry args={[500, 25]} />
        <meshStandardMaterial color="#e5e5e5" transparent opacity={0.95} side={2} />
      </mesh>

      {/* South wall (front) */}
      <mesh position={[0, 12.5, 125]} rotation={[0, Math.PI, 0]} castShadow>
        <planeGeometry args={[500, 25]} />
        <meshStandardMaterial color="#e5e5e5" transparent opacity={0.95} side={2} />
      </mesh>

      {/* West wall (left) */}
      <mesh position={[-250, 12.5, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <planeGeometry args={[250, 25]} />
        <meshStandardMaterial color="#e5e5e5" transparent opacity={0.95} side={2} />
      </mesh>

      {/* East wall (right - gate side) */}
      <mesh position={[250, 12.5, 0]} rotation={[0, -Math.PI / 2, 0]} castShadow>
        <planeGeometry args={[250, 25]} />
        <meshStandardMaterial color="#e5e5e5" transparent opacity={0.95} side={2} />
      </mesh>

      {/* Gate curtain (colorful entrance) */}
      <mesh position={[250, 12.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[100, 25]} />
        <meshStandardMaterial color="#6b21a8" transparent opacity={0.85} side={2} />
      </mesh>

      {/* === BRONZE ALTAR === */}
      <group position={[100, 0, 0]}>
        {/* Altar base */}
        <mesh position={[0, 2, 0]} castShadow>
          <boxGeometry args={[45, 4, 45]} />
          <meshStandardMaterial color="#92400e" />
        </mesh>
        {/* Altar body */}
        <mesh position={[0, 18, 0]} castShadow>
          <boxGeometry args={[40, 32, 40]} />
          <meshStandardMaterial color="#78350f" roughness={0.8} />
        </mesh>
        {/* Fire on altar */}
        <Fire position={[0, 38, 0]} />
      </group>

      {/* === THE TABERNACLE === */}
      <group position={[-100, 0, 0]}>
        {/* Silver foundation */}
        <mesh position={[0, 1.5, 0]} castShadow>
          <boxGeometry args={[150, 3, 50]} />
          <meshStandardMaterial color="#c0c0c0" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* North wall - gold */}
        <mesh position={[0, 27, -25]} castShadow>
          <boxGeometry args={[150, 50, 2]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* South wall - gold */}
        <mesh position={[0, 27, 25]} castShadow>
          <boxGeometry args={[150, 50, 2]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* West wall - gold */}
        <mesh position={[-75, 27, 0]} castShadow>
          <boxGeometry args={[2, 50, 50]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* East entrance veil - purple/blue */}
        <mesh position={[75, 27, 0]}>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial color="#6b21a8" transparent opacity={0.9} side={2} />
        </mesh>

        {/* Roof - red ram skins */}
        <mesh position={[0, 52, 0]} rotation={[0, 0, 0]} castShadow>
          <boxGeometry args={[150, 2, 50]} />
          <meshStandardMaterial color="#7f1d1d" />
        </mesh>
      </group>
    </>
  );
}

// Main export component
export default function Tabernacle3D() {
  return (
    <div className="relative w-full h-[500px] bg-gradient-to-b from-stone-950 to-stone-900 rounded-xl border-2 border-gold-700/30 overflow-hidden shadow-2xl">
      <Canvas
        camera={{ position: [400, 250, 400], fov: 50 }}
        shadows
      >
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[200, 300, 200]}
          intensity={0.9}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <directionalLight
          position={[-200, 200, -200]}
          intensity={0.3}
        />
        
        <TabernacleStructure />
        
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={200}
          maxDistance={800}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-parchment-100/90 px-4 py-2 rounded-full border border-amber-600 backdrop-blur-sm">
        <p className="text-stone-800 text-xs font-cinzel">Drag to rotate • Scroll to zoom • Right-click to pan</p>
      </div>
    </div>
  );
}
