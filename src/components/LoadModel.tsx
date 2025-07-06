import React, { useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useControls, button } from "leva";
import * as THREE from "three";

/**
 * LoadModel - Loads a GLTF model and provides a Leva button to play all animations once.
 * @param url - Path to the GLTF/GLB file
 * @param onLoaded - Optional callback when model is loaded
 * @param ...props - Additional props for the primitive
 */
export default function LoadModel({
  url,
  onLoaded,
  ...props
}: {
  url: string;
  onLoaded?: (scene: THREE.Group) => void;
  [key: string]: any;
}) {
  const group = useRef<THREE.Group>(null!);
  // Always append .glb to the url
  const modelPath = `/models/${url}.glb`;
  const { scene, animations } = useGLTF(modelPath);
  const { actions } = useAnimations(animations, group);

  // Leva button to play all animations once
  // useControls("Model Controls", {
  //   Play_Animation: button(() => {
  //     if (!actions || Object.keys(actions).length === 0) return;
  //     Object.values(actions).forEach((action) => {
  //       if (action) {
  //         action.reset();
  //         action.setLoop(THREE.LoopOnce, 1);
  //         action.clampWhenFinished = true;
  //         action.paused = false;
  //         action.play();
  //       }
  //     });
  //   }),
  // });

  React.useEffect(() => {
    if (onLoaded && group.current) onLoaded(group.current);
  }, [onLoaded]);

  return <primitive ref={group} object={scene} {...props} />;
}

// Drei GLTF loader cache
useGLTF.preload = useGLTF.preload || (() => {});
