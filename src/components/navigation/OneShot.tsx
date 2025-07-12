import { useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface OneShotProps {
  position?: [number, number, number];
  lookAt?: [number, number, number];
  maxOffset?: number;
  sensitivity?: number;
}

export default function OneShot({
  position = [0, 20, 170],
  lookAt = [0, 0, 0],
  maxOffset = 2,
  sensitivity = 0.02,
}: OneShotProps) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(...lookAt));
  const basePosition = useRef(new THREE.Vector3(...position));
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Mouse move handler
  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      // Normalize mouse to [-1, 1]
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    }
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  // Camera update
  useFrame(() => {
    // Calculate offset
    const offsetX = -THREE.MathUtils.clamp(mouse.current.x, -1, 1) * maxOffset;
    const offsetY = -THREE.MathUtils.clamp(mouse.current.y, -1, 1) * maxOffset;
    // Set camera position with offset
    camera.position.lerp(
      new THREE.Vector3(
        basePosition.current.x + offsetX,
        basePosition.current.y + offsetY,
        basePosition.current.z
      ),
      0.1 // smoothness
    );
    camera.lookAt(target.current);
  });

  // Set initial position and lookAt
  useEffect(() => {
    camera.position.set(...position);
    camera.lookAt(...lookAt);
  }, [camera, position, lookAt]);

  return null;
}
