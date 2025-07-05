import React, { useEffect, useRef, useState } from "react";
import { PerspectiveCamera, CameraControls } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import { useControls, button } from "leva";
import * as THREE from "three";
import useLipstickExperience from "../hooks/useLipstickExperience";

export function ManualCameraController() {
  const camRef = useRef(null);
  const controlsRef = useRef(null);
  const { set, camera } = useThree();
  const [keys, setKeys] = useState({});
  const { initialCam, setInitialCam } = useLipstickExperience();

  useEffect(() => {
    if (!initialCam || !camRef.current || !controlsRef.current) return;

    // Copy transform + projection
    camRef.current.matrix.copy(initialCam.matrixWorld);
    camRef.current.matrix.decompose(
      camRef.current.position,
      camRef.current.quaternion,
      camRef.current.scale
    );
    camRef.current.fov = initialCam.fov;
    camRef.current.aspect = initialCam.aspect;
    camRef.current.near = initialCam.near;
    camRef.current.far = initialCam.far;
    camRef.current.updateProjectionMatrix();
    set({ camera: camRef.current });

    // Set controls to match starting position + look direction
    const dir = new THREE.Vector3();
    camRef.current.getWorldDirection(dir);
    const target = camRef.current.position.clone().add(dir.multiplyScalar(10));
    controlsRef.current.setLookAt(
      camRef.current.position.x,
      camRef.current.position.y,
      camRef.current.position.z,
      target.x,
      target.y,
      target.z
    );

    // Key listeners
    const down = (e) =>
      setKeys((prev) => ({ ...prev, [e.key.toLowerCase()]: true }));
    const up = (e) =>
      setKeys((prev) => ({ ...prev, [e.key.toLowerCase()]: false }));
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);

    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [initialCam, set]);

  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    const speed = (keys["shift"] ? 105 : 50) * delta;
    const rotSpeed = 0.5 * delta;

    if (keys["w"]) controlsRef.current.forward(speed, false);
    if (keys["s"]) controlsRef.current.forward(-speed, false);
    if (keys["a"]) controlsRef.current.truck(-speed, 0, false);
    if (keys["d"]) controlsRef.current.truck(speed, 0, false);
    if (keys[" "]) controlsRef.current.truck(0, speed, false); // up
    if (keys["c"]) controlsRef.current.truck(0, -speed, false); // down

    if (keys["arrowleft"]) controlsRef.current.rotate(-rotSpeed, 0, false);
    if (keys["arrowright"]) controlsRef.current.rotate(rotSpeed, 0, false);
    if (keys["arrowup"]) controlsRef.current.rotate(0, -rotSpeed, false);
    if (keys["arrowdown"]) controlsRef.current.rotate(0, rotSpeed, false);

    controlsRef.current.update(delta);
  });

  useControls("Manual Cam Posiiton", {
    "Log Cam Info": button(() => {
      const cam = controlsRef.current?.camera;
      if (!cam) return;

      console.log("Camera position:", cam.position);
      console.log("Camera rotation (Euler):", cam.rotation);
      console.log("Camera quaternion:", cam.quaternion);
      console.log("FOV:", cam.fov, "Near:", cam.near, "Far:", cam.far);
      console.log("Up vector:", cam.up);
      console.log("Real Position", camera.position);
    }),
  });

//   useControls({
//     logCamera: button(() => {
//       const cam = controlsRef.current?.camera;
//       if (!cam) return;

//       console.log("Camera position:", cam.position);
//       console.log("Camera rotation (Euler):", cam.rotation);
//       console.log("Camera quaternion:", cam.quaternion);
//       console.log("FOV:", cam.fov, "Near:", cam.near, "Far:", cam.far);
//       console.log("Up vector:", cam.up);
//       console.log("Real Position", camera.position);
//     }),
//   });

  return (
    <>
      <PerspectiveCamera ref={camRef} makeDefault />
      <CameraControls ref={controlsRef} />
    </>
  );
}
