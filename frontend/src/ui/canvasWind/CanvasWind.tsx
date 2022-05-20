import { Cloud } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

interface Props {
  lightIntensity?: number;
}

const CanvasWind = ({ lightIntensity }: Props) => {
  return (
    <Canvas>
      <ambientLight intensity={lightIntensity} />
      <Cloud
        opacity={0.5}
        speed={1.5} // Rotation speed
        width={20} // Width of the full cloud
        depth={0.2} // Z-dir depth
        segments={200} // Number of particles
      />
    </Canvas>
  );
};

export default CanvasWind;
