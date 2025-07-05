import React, { useRef, useState } from "react";
import { useGLTF, CameraControls } from "@react-three/drei";
import { useAnimationFlow } from "../hooks/useAnimationFlow";
import type CameraControlsType from "camera-controls";
import cameraPresets from "../config/cameraPresets.json";
import {
  transitionCameraToPreset,
  getCameraPresetByName,
} from "../utils/cameraHelper";
import useExperience from "../hooks/useExperience";
import { useControls, button } from "leva";

export default function Test_Camera() {
  // 1. Setup refs and state
  const group = useRef<any>(null);
  const controlsRef = useRef<CameraControlsType | null>(null);
  const { scene } = useGLTF("/models/test_camera.glb");
  const {
    setCameraBusy,
    controlEnabled,
    setControlEnabled,
    currentState,
    setCurrentState,
  } = useExperience();
  const cameraStates = ["intro", "main"];

  useControls(
    "Camera States",
    cameraStates.reduce((acc, state) => {
      acc[`Go to: ${state}`] = button(() => setCurrentState(state));
      //   console.log("Current state: ", currentState)
      return acc;
    }, {} as Record<string, any>)
  );

  // 2. Camera actions using the generic transition helper
  const cameraActions = {
    playIntro: async () => {
      if (!controlsRef.current) return;
      await transitionCameraToPreset(
        controlsRef.current,
        cameraPresets,
        "intro",
        { setCameraBusy, setControlEnabled, smooth: true }
      );
    },
    playMain: async () => {
      if (!controlsRef.current) return;
      await transitionCameraToPreset(
        controlsRef.current,
        cameraPresets,
        "blender",
        { setCameraBusy, setControlEnabled, smooth: true }
      );
    },
  };

  // 4. Hook up animation flow (example: you can trigger actions by state)
  const transitionMap = {
    "*->intro": cameraActions.playIntro,
    "*->main": cameraActions.playMain,
    // etc.
  };

  const { goToState } = useAnimationFlow(
    currentState,
    setCurrentState,
    transitionMap
  );

  // 5. Render
  return (
    <>
      <primitive object={scene} ref={group} />
      <CameraControls ref={controlsRef} enabled={controlEnabled} />
    </>
  );
}
