import { Cloud, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

const CanvasWind = () => {
  return (
    <Canvas>
      <Cloud
        opacity={0.5}
        speed={0.4} // Rotation speed
        width={10} // Width of the full cloud
        depth={1.5} // Z-dir depth
        segments={20} // Number of particles
      />
    </Canvas>
  );
};

export default CanvasWind;
