import React, { useRef, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useControls, button } from "leva";
import * as THREE from "three";
import { KTX2Loader } from "three/examples/jsm/Addons.js";
import { useThree } from "@react-three/fiber";
import useAnimationHelper from "../hooks/useAnimationHelper";

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
  const gl = useThree((state) => state.gl); // <-- get gl here!
  const modelPath = `${url}.glb`;
  const { scene, animations } = useGLTF(
    modelPath,
    undefined,
    undefined,
    (loader) => {
      const ktx2loader = new KTX2Loader();
      ktx2loader.setTranscoderPath(
        "https://cdn.jsdelivr.net/gh/pmndrs/drei-assets/basis/"
      );
      ktx2loader.detectSupport(gl); // <-- use the correct gl
      loader.setKTX2Loader(ktx2loader);
    }
  );
  const { actions } = useAnimations(animations, group);
  const animationNames = Object.keys(actions);
  const animationHelper = useAnimationHelper(actions, animationNames, group);

  useEffect(() => {
    console.log("Actions available: ", actions);
  }, [actions]);

  // Leva button to play all animations once
  useControls("Model Controls", {
    Play_Animation: button(() => {
      if (!actions || Object.keys(actions).length === 0) return;
      Object.values(actions).forEach((action) => {
        if (action) {
          action.reset();
          action.setLoop(THREE.LoopOnce, 1);
          action.clampWhenFinished = true;
          action.paused = false;
          action.play();
        }
      });
    }),
  });

  React.useEffect(() => {
    if (onLoaded && group.current) onLoaded(group.current);
  }, [onLoaded]);

  return <primitive ref={group} object={scene} {...props} />;
}

// Drei GLTF loader cache
useGLTF.preload = useGLTF.preload || (() => {});
