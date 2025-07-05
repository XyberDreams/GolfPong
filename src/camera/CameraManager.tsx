import { useControls, button } from "leva";
import useExperience from "../hooks/useExperience";
import { useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import cameraPresets from "../config/cameraPresets.json";

export default function CameraManager() {
  const { activeCamera, setActiveCamera, currentState, setCurrentState } = useExperience();
  const { camera, set, scene } = useThree();
  const [activePreset, setActivePreset] = useState(cameraPresets[0]);
  const debugCameraRef = useRef(
    new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
  );
  const presetCameraRef = useRef(
    new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
  );
  const levaPreset =
    cameraPresets.find((p) => p.name === "Leva") || cameraPresets[0];
  const [activePresetIndex, setActivePresetIndex] = useState(0);
  const [debugCamState, setDebugCamState] = useState({
    position: { ...levaPreset.position },
    rotation: { ...levaPreset.rotation },
  });




  // Preset camera buttons (for preset camera only)
  useControls(
    "Preset Camera Presets",
    cameraPresets.reduce((acc, preset, idx) => {
      acc[`Jump to: ${preset.name}`] = button(() => setActivePresetIndex(idx));
      return acc;
    }, {} as Record<string, any>)
  );

  // Debug camera Leva controls (for debug camera only)
  useControls(
    "Debug Camera Controls",
    {
      position: {
        value: debugCamState.position,
        step: 0.1,
        onChange: (v: { x: number; y: number; z: number }) => {
          setDebugCamState((prev) => ({ ...prev, position: { ...v } }));
        },
      },
      rotation: {
        value: debugCamState.rotation,
        step: 0.01,
        onChange: (v: { x: number; y: number; z: number }) => {
          setDebugCamState((prev) => ({ ...prev, rotation: { ...v } }));
        },
      },
    },
    [debugCamState]
  );

  // Effect: update camera transforms and set active camera in R3F
  useEffect(() => {
    if (activeCamera === "debugCamera") {
      debugCameraRef.current.position.set(
        debugCamState.position.x,
        debugCamState.position.y,
        debugCamState.position.z
      );
      debugCameraRef.current.rotation.set(
        debugCamState.rotation.x,
        debugCamState.rotation.y,
        debugCamState.rotation.z
      );
      set({ camera: debugCameraRef.current });
    } else if (activeCamera === "presetCamera") {
      const preset = cameraPresets[activePresetIndex];
      presetCameraRef.current.position.set(
        preset.position.x,
        preset.position.y,
        preset.position.z
      );
      presetCameraRef.current.rotation.set(
        preset.rotation.x,
        preset.rotation.y,
        preset.rotation.z
      );
      set({ camera: presetCameraRef.current });
    }
    // If blenderCamera, handled elsewhere
  }, [activeCamera, debugCamState, activePresetIndex, set]);
  return null;
}
