'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

export default function SceneCanvas() {
  return (
    <div className="h-[60vh] w-full rounded-lg border">
      <Canvas camera={{ position: [0, 0.8, 3.2], fov: 45 }} dpr={[1, 2]}>
        {/* background */}
        <color attach="background" args={['#0b0b0b']} />

        {/* simple lights */}
        <ambientLight intensity={0.25} />
        <directionalLight position={[3, 4, 2]} intensity={1.2} />

        {/* our cube */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#d9d9d9" roughness={0.7} metalness={0.0} />
        </mesh>

        <OrbitControls enablePan={false} />
      </Canvas>
    </div>
  );
}
