import { useState, useEffect } from "react";
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
import { CharacterController } from "./components/character controller/CharacterController";
import { Physics } from "@react-three/rapier";
import Floor from "./components/objects/Floor";
import {
  CameraControls,
  Environment,
  PerspectiveCamera,
} from "@react-three/drei";
import KTX2Support from "./components/KTX2Support";
import PCExperience from "./components/PCExperience";

import PowerMeterRevised from "./ui/PowerMeterRevised";
import PowerBarImage from "./ui/PowerBarImage";
import { GP_Scene2 } from "./components/Gp_Scene2.jsx";
import MobileUIController from "./ui/MobileUIController";
import { GP_Ball } from "./components/Gp_Ball.jsx";
import GP_Scene from "./components/GP_Scene.jsx";
import Test_Dissolve from "./components/Test_Dissolve.jsx";
import MobileCanvasController from "./components/MobileCanvasController";
import Loader from "./components/Loader";

function App() {
  const isMobile = useIsMobile();
  const { activeCamera, navigationPOV, setGpExperienceState } = useExperience();
  const [ktxReady, setKtxReady] = useState(false);

  const handleShow = () => {};

  return (
    <>
      {isMobile ? (
        <>
          <MobileUIController />
          {/* <button onClick={() => setGpExperienceState?.("gameStart")}>
            Start Game
          </button>
          <button
            className="z-[10000] w-[500px] bg-red-500 pointer-events-auto fixed"
            onClick={() => setGpExperienceState?.("gameFinsh")}
          >
            End Game
          </button> */}

          {/* <Loader isReady={ktxReady}/> */}

          <Canvas>
            {!ktxReady && <KTX2Support onReady={() => setKtxReady(true)} />}

            {/* <CameraControls /> */}
            <MobileCanvasController />
            {activeCamera === "blenderCamera" && (
              <BlenderCamera url="/golfpong/gp_camera2" />
            )}
            <Environment preset="city" />
          </Canvas>
        </>
      ) : (
        <>
          {/* <PowerMeter /> */}
          <PowerMeterRevised />
          {/* <SwingMessage /> */}
          <Canvas>
            {/* {!ktxReady && <KTX2Support onReady={() => setKtxReady(true)} />} */}
            {/* <GP_Scene2 /> */}
            {activeCamera === "blenderCamera" && (
              <BlenderCamera url="/golfpong/gp_camera" />
            )}
            <PCExperience />
            {/* <CameraControls /> */}
            {/* {activeCamera === "presetCamera" && <CameraManager />}
            {activeCamera === "blenderCamera" && (
              <BlenderCamera url="/golfpong/gp_camera" />
            )}
            {activeCamera === "animatedCamera" && <Test_Camera />}
            <CameraSwitcher /> */}
            <Environment preset="city" />
          </Canvas>

          {/* <BGSoundToggleIcon />
          <SFXButtons /> */}
        </>
      )}
    </>
  );
}

export default App;
