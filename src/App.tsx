import { useState } from "react";
import "./App.css";
import useIsMobile from "./hooks/useIsMobile";
import LoadModel from "./components/LoadModel";
import { Canvas } from "@react-three/fiber";
import GeneralCameraController from "./camera/GeneralCameraController";
import BlenderCamera from "./camera/BlenderCamera";
import CameraManager from "./camera/CameraManager";
import Test_Camera from "./camera/Test_Camera";
import useExperience from "./hooks/useExperience";
import CameraSwitcher from "./camera/CameraSwitcher";
import { Portal, BackButton } from "./components/portal/Portal";
import { CharacterController } from "./components/navigation/CharacterController";
import { Physics } from "@react-three/rapier";
import Floor from "./components/objects/Floor";
import { Environment } from "@react-three/drei";

function App() {
  const isMobile = useIsMobile();
  const { activeCamera } = useExperience();
  return (
    <>
      {isMobile ? (
        <>
          <Canvas>
            <LoadModel url="lipstick" />
          </Canvas>
        </>
      ) : (
        <>
          {/* <Canvas>
            <LoadModel url="test_scene" />
            {activeCamera === "presetCamera" && <CameraManager />}
            {activeCamera === "blenderCamera" && (
              <BlenderCamera url="test_camera" />
            )}
            {activeCamera === "animatedCamera" && <Test_Camera />}
            <CameraSwitcher />
          </Canvas> */}
          {/* <BackButton/>
          <Portal/> */}
          <Canvas>
            <LoadModel url="test_scene" />
            <Environment preset="city"/>

            <Physics timeStep="vary">
              <CharacterController characterURL="/models/hoshi.glb" />
              <Floor position={[-305.063, 99.224, -135.983]} />
            </Physics>
          </Canvas>
        </>
      )}
    </>
  );
}

export default App;
