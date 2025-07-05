import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RefObject } from "react";

/**
 * useHoverScale - Scales meshes in a group when hovered.
 * @param groupRef - Ref to the THREE.Group containing meshes
 * @param hoveredMeshName - Name of the mesh to scale up
 * @param scale - Scale factor when hovered (default: 1.05)
 * @param lerp - Lerp factor for smooth scaling (default: 0.1)
 */
export function useHoverScale(
  groupRef: RefObject<THREE.Group>,
  hoveredMeshName: string | null,
  scale: number = 1.05,
  lerp: number = 0.1
) {
  useFrame(() => {
    if (!groupRef.current || !(groupRef.current instanceof THREE.Object3D))
      return;
    groupRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const isHovered = hoveredMeshName === child.name;
        child.scale.lerp(
          new THREE.Vector3(
            isHovered ? scale : 1,
            isHovered ? scale : 1,
            isHovered ? scale : 1
          ),
          lerp
        );
      }
    });
  });
}
