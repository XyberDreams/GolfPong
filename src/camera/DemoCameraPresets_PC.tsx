import React, { useRef, useEffect, useState } from "react";
import { useControls, button } from "leva";
import * as THREE from "three";
import cameraPresets from "../config/cameraPresets.json";

export default function DemoCameraPresets_PC() {
  // Camera ref (could be used with CameraControls, etc)
  const cameraRef = useRef<THREE.PerspectiveCamera>(
    new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
  );

  // State for which preset is active
  const [activePresetIndex, setActivePresetIndex] = useState(0);
  const activePreset = cameraPresets[activePresetIndex];

  // Leva buttons to switch presets
  useControls(
    "Camera Presets",
    cameraPresets.reduce((acc, preset, idx) => {
      acc[`Set: ${preset.name}`] = button(() => setActivePresetIndex(idx));
      return acc;
    }, {} as Record<string, any>)
  );

  // Apply preset values to camera when preset changes
  useEffect(() => {
    const cam = cameraRef.current;
    cam.position.set(
      activePreset.position.x,
      activePreset.position.y,
      activePreset.position.z
    );
    cam.rotation.set(
      activePreset.rotation.x,
      activePreset.rotation.y,
      activePreset.rotation.z
    );
    if (activePreset.fov !== undefined) cam.fov = activePreset.fov;
    if (activePreset.near !== undefined) cam.near = activePreset.near;
    if (activePreset.far !== undefined) cam.far = activePreset.far;
    cam.updateProjectionMatrix();
    // You could also apply other properties to controls here
    // e.g., minAzimuthAngle, maxAzimuthAngle, etc.
  }, [activePreset]);

  // Optionally, show current camera state
  return (
    <div style={{ color: "#fff" }}>
      <h3>Active Camera Preset: {activePreset.name}</h3>
      <pre>{JSON.stringify(activePreset, null, 2)}</pre>
    </div>
  );
}
