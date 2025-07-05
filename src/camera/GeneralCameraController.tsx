import React, { useRef, useEffect, useState, useContext } from "react";
import { PerspectiveCamera, CameraControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useControls, button } from "leva";
import * as THREE from "three";
import useExperience from "../hooks/useExperience";

/**
 * GeneralCameraController
 * - Provides CameraControls and PerspectiveCamera
 * - Leva panel for taking over camera, logging info, and interactively setting position/target
 * - Debugging tools for camera state
 */
export default function GeneralCameraController() {
  const camRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);
  const { camera, set } = useThree();
  const [hasControl, setHasControl] = useState(false);
  const { activeCamera, setActiveCamera } = useExperience();

  // Leva controls for camera debugging and manipulation
  useControls("Camera Debug", {
    "Take over from camera": button(() => {
      if (controlsRef.current && camRef.current) {
        controlsRef.current.setPosition(
          camera.position.x,
          camera.position.y,
          camera.position.z,
          false
        );
        controlsRef.current.setTarget(0, 0, 0, false); // Adjust as needed
        controlsRef.current.update(0);
        set({ camera: controlsRef.current.camera });
        setActiveCamera(controlsRef.current.camera);
        setHasControl(true);

        console.log("CameraControls is now controlling the camera.");
      }
    }),
    "Log camera info": button(() => {
      console.log("Active camera:", camera);
      console.log("Position:", camera.position);
      console.log("Rotation (Euler):", camera.rotation);
      console.log("Quaternion:", camera.quaternion);
      if ((camera as any).fov) {
        console.log("FOV:", (camera as any).fov);
      }
    }),
    position: {
      value: {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z,
      },
      step: 0.1,
      onChange: (v) => {
        if (controlsRef.current) {
          const target = new THREE.Vector3();
          controlsRef.current.getTarget(target);
          controlsRef.current.setLookAt(
            v.x,
            v.y,
            v.z,
            target.x,
            target.y,
            target.z,
            false
          );
          controlsRef.current.update(0);
        }
      },
    },
    target: {
      value: { x: 0, y: 0, z: 0 },
      step: 0.1,
      onChange: (v) => {
        if (controlsRef.current) {
          const pos = controlsRef.current.getPosition(new THREE.Vector3());
          controlsRef.current.setLookAt(
            pos.x,
            pos.y,
            pos.z,
            v.x,
            v.y,
            v.z,
            false
          );
          controlsRef.current.update(0);
        }
      },
    },
  });

  useEffect(() => {
    if (hasControl) {
      console.log("GeneralCameraController has control of the camera.");
    }
  }, [hasControl]);

  // Optionally, sync the PerspectiveCamera with the default R3F camera on mount
  //   useEffect(() => {
  //     if (camRef.current) {
  //       set({ camera: camRef.current });
  //     }
  //   }, [set]);

  return (
    <>
      {hasControl && (
        <>
          <PerspectiveCamera ref={camRef} />
          <CameraControls ref={controlsRef} />
        </>
      )}
    </>
  );
}
