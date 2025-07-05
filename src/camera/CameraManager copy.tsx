import { useControls, button } from "leva";
import useExperience from "../hooks/useExperience";
import { useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import cameraPresets from "../config/cameraPresets.json";

export default function CameraManager() {
  const { activeCamera, setActiveCamera } = useExperience();
  const { camera, set, scene } = useThree();
  // Always use a single instance of PerspectiveCamera for debug
  const debugCameraRef = useRef<THREE.PerspectiveCamera>(
    (() => {
      const cam = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      cam.name = "DebugCamera";
      return cam;
    })()
  );
  const levaPreset = cameraPresets.find((p) => p.name === "Leva");
  // State to sync Leva controls with camera
  const [debugCamState, setDebugCamState] = useState(() =>
    levaPreset
      ? {
          position: { ...levaPreset.position },
          rotation: { ...levaPreset.rotation },
        }
      : {
          position: { x: 0, y: 0, z: 0 },
          rotation: { x: 0, y: 0, z: 0 },
        }
  );
  // Key to force Leva controls to remount and sync
  const [levaKey, setLevaKey] = useState(0);

  // Set debug camera to 'Leva' preset on mount and when levaPreset changes
  useEffect(() => {
    if (levaPreset && debugCameraRef.current) {
      debugCameraRef.current.position.set(
        levaPreset.position.x,
        levaPreset.position.y,
        levaPreset.position.z
      );
      debugCameraRef.current.rotation.set(
        levaPreset.rotation.x,
        levaPreset.rotation.y,
        levaPreset.rotation.z
      );
      setDebugCamState({
        position: { ...levaPreset.position },
        rotation: { ...levaPreset.rotation },
      });
    }
  }, [levaPreset, cameraPresets]);

  useControls(
    "Camera Presets",
    cameraPresets.reduce((acc, preset) => {
      acc[`Set: ${preset.name}`] = button(() => {
        if (activeCamera === "debugCamera" && debugCameraRef.current) {
          debugCameraRef.current.position.set(
            preset.position.x,
            preset.position.y,
            preset.position.z
          );
          debugCameraRef.current.rotation.set(
            preset.rotation.x,
            preset.rotation.y,
            preset.rotation.z
          );
          setDebugCamState({
            position: { ...preset.position },
            rotation: { ...preset.rotation },
          });
          setLevaKey((k) => k + 1); // force Leva controls to remount
        }
      });
      return acc;
    }, {} as Record<string, any>)
  );

  // Switch logic
  useControls("Camera Switch", {
    "Use Blender Camera": button(() => {
      setActiveCamera("blenderCamera");
    }),
    "Use Debug Camera": button(() => {
      setActiveCamera("debugCamera");
    }),
  });

  // Debug camera setup
  useEffect(() => {
    if (activeCamera === "debugCamera") {
      // Remove Blender camera if present
      const blenderCam = scene.children.find(
        (obj) =>
          obj instanceof THREE.PerspectiveCamera &&
          obj !== debugCameraRef.current
      );
      if (blenderCam) {
        scene.remove(blenderCam);
      }
      // Add debug camera if not present
      if (!scene.children.includes(debugCameraRef.current)) {
        scene.add(debugCameraRef.current);
      }
      set({ camera: debugCameraRef.current });
    }
  }, [activeCamera, set, scene]);

  // Camera position controls for debug camera (always call hooks unconditionally)
  useControls(
    "Debug Camera Controls",
    {
      position: {
        value: debugCamState.position,
        step: 0.1,
        onChange: (v: { x: number; y: number; z: number }) => {
          debugCameraRef.current.position.set(v.x, v.y, v.z);
          setDebugCamState((prev) => ({ ...prev, position: { ...v } }));
        },
      },
      rotation: {
        value: debugCamState.rotation,
        step: 0.01,
        onChange: (v: { x: number; y: number; z: number }) => {
          debugCameraRef.current.rotation.set(v.x, v.y, v.z);
          setDebugCamState((prev) => ({ ...prev, rotation: { ...v } }));
        },
      },
    },
    [activeCamera, cameraPresets, debugCamState, levaKey]
  );

  // Global logger
  useControls("Camera Debug", {
    "Log current camera": button(() => {
      if (activeCamera === "blenderCamera") {
        const blenderCam = scene.children.find(
          (obj) =>
            obj instanceof THREE.PerspectiveCamera &&
            obj !== debugCameraRef.current
        ) as THREE.PerspectiveCamera | undefined;
        if (blenderCam) {
          console.log("[CameraManager] Blender camera:", blenderCam);
          console.log("Position:", blenderCam.position);
          console.log("Rotation (Euler):", blenderCam.rotation);
          console.log("Quaternion:", blenderCam.quaternion);
          if ((blenderCam as any).fov) {
            console.log("FOV:", (blenderCam as any).fov);
          }
          return;
        }
      }
      // Otherwise, log the current R3F camera (debug or fallback)
      console.log("[CameraManager] Active camera type:", activeCamera);
      console.log("[CameraManager] R3F camera:", camera);
      console.log("Position:", camera.position);
      console.log("Rotation (Euler):", camera.rotation);
      console.log("Quaternion:", camera.quaternion);
      if ((camera as any).fov) {
        console.log("FOV:", (camera as any).fov);
      }
    }),
  });

  useEffect(() => {
    console.log("[CameraManager] Current active camera type:", activeCamera);
    console.log(
      "All cameras in scene:",
      scene.children.filter((obj) => obj instanceof THREE.PerspectiveCamera)
    );
  }, [activeCamera]);

  return null;
}
