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
          <BackButton/>
          <Portal/>
        </>
      )}
    </>
  );
}

export default App;
