import { useState } from "react";
import "./App.css";
import useIsMobile from "./hooks/useIsMobile";
import LoadModel from "./components/LoadModel";
import { Canvas } from "@react-three/fiber";
import GeneralCameraController from "./camera/GeneralCameraController";
import BlenderCamera from "./camera/BlenderCamera";
import CameraManager from "./camera/CameraManager";

function App() {
  const isMobile = useIsMobile();
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
          <Canvas>
            <LoadModel url="test_scene" />
            {/* <GeneralCameraController /> */}
            <CameraManager />
            <BlenderCamera
              url="test_camera"
            />
          </Canvas>
        </>
      )}
    </>
  );
}

export default App;
