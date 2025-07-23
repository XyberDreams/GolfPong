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
import OneShot from "./components/navigation/OneShot";
import Hotspot from "./components/Hotspot";
import BGSoundToggleIcon from "./sound/BGSoundToggleIcon";
import SFXButtons from "./sound/SFXButton";
import KTX2Support from "./components/KTX2Support";
import PCExperience from "./components/PCExperience";
import PowerMeter from "./ui/PowerMeter";
import SwingMessage from "./ui/SwingMessage";
import PowerMeterRevised from "./ui/PowerMeterRevised";
import PowerBarImage from "./ui/PowerBarImage";
import { GP_Scene2 } from "./components/Gp_scene2";
import MobileUIController from "./ui/MobileUIController";
import { GP_Ball } from "./components/Gp_ball";

function App() {
  const isMobile = useIsMobile();
  const { activeCamera, navigationPOV } = useExperience();
  const [ktxReady, setKtxReady] = useState(false);

  return (
    <>
      {isMobile ? (
        <>
          {/* <PowerMeterRevised />
          <SwingMessage /> */}
          <MobileUIController/>
          

          {/* <PowerBarImage /> */}

          {/* <SwingMessage /> */}
          <Canvas>
                        {!ktxReady && <KTX2Support onReady={() => setKtxReady(true)} />}

               <CameraControls />
               <GP_Ball />
               <GP_Scene2 />
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

            <PCExperience />
            <CameraControls />
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
