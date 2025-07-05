import React, { useEffect, useState } from "react";
import { useControls, button } from "leva";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CameraControls } from "@react-three/drei";

export default function CameraLeva({
  controlsRef,
}: {
  controlsRef: React.RefObject<CameraControls>;
}) {
  const { camera, set } = useThree();
  const [hasControl, setHasControl] = useState(false);

  const logCameraInfo = () => {
    console.log("Camera position:", camera.position);
    console.log("Camera rotation:", camera.rotation);
    console.log("Camera scale:", camera.scale);
    if (controlsRef.current) {
      const target = new THREE.Vector3();
      controlsRef.current.getTarget(target);
      console.log("Camera target:", target);
      console.log("CameraControls camera uuid:", controlsRef.current.camera.uuid);
    }
    console.log("Active camera uuid:", camera.uuid);
  };

  const syncControls = () => {
    if (controlsRef.current) {
      controlsRef.current.setPosition(
        camera.position.x,
        camera.position.y,
        camera.position.z,
        false
      );
      controlsRef.current.setTarget(0, 0, 0, false); // Or adjust if you want
      controlsRef.current.update(0);
      set({ camera: controlsRef.current.camera }); // Explicitly set as main camera
      setHasControl(true);
      console.log("CameraControls is now controlling the camera.");
    }
  };

  useControls("Camera Leva", {
    "Take over from camera": button(syncControls),
    "Log camera info": button(logCameraInfo),
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
          controlsRef.current.setLookAt(v.x, v.y, v.z, target.x, target.y, target.z, false);
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
          controlsRef.current.setLookAt(pos.x, pos.y, pos.z, v.x, v.y, v.z, false);
          controlsRef.current.update(0);
        }
      },
    },
  });

  useEffect(() => {
    if (hasControl) {
      console.log("CameraLeva has control of the camera.");
    }
  }, [hasControl]);

  return null;
}
