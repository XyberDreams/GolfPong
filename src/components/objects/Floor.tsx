import { RigidBody, CuboidCollider } from "@react-three/rapier";

interface FloorProps {
  position: [number, number, number];
}

export default function Floor({ position }: FloorProps) {
  return (
    <RigidBody type="fixed" colliders="hull">
      <CuboidCollider position={position} args={[700, 2, 700]} />
      <mesh position={position}>
        <boxGeometry args={[700, 2, 700]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </RigidBody>
  );
}