import { Cloud, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

const CanvasWind = () => {
  return (
    <Canvas>
      <Cloud
        opacity={0.5}
        speed={1.5} // Rotation speed
        width={20} // Width of the full cloud
        depth={0.5} // Z-dir depth
        segments={100} // Number of particles
      />
    </Canvas>
  );
};

export default CanvasWind;
