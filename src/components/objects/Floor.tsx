import { RigidBody, CuboidCollider } from "@react-three/rapier";

export default function Floor({ position }) {
  return (
    <RigidBody type="fixed" colliders="hull">
      <CuboidCollider position={position} args={[700, 5, 700]} />
      <mesh position={[0, -3.5, 0]}>
        <boxGeometry args={[700, 5, 700]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </RigidBody>
  );
}
