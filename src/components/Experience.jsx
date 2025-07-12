import {
  OrbitControls,
  Environment,
  Grid,
  KeyboardControls,
  PerspectiveCamera,
  Bvh,
} from "@react-three/drei";
import { CuboidCollider, Physics } from "@react-three/rapier";
import { useEffect, useState, Suspense, useRef, useMemo } from "react";
import { useControls, button } from "leva";
import Ecctrl, { EcctrlAnimation } from "ecctrl";
import { useThree, useFrame } from "@react-three/fiber";
import { LevelLoader } from "./LevelLoader";
import useXyber from "../../hooks/useXyber";
import * as THREE from "three";
import { runAnimation } from "../../utils/positionAnimation";
import { Aestheticlayer } from "../mvp/models/Aestheticlayer";
import MusicPlayer from "../mvp/components/MusicPlayer";
// import { Hoshi } from "./Hoshi";
import CharacterSFX from "../mvp/gameObjects/CharacterSFX";
import { useSoundManager } from "../../hooks/useSoundManager";
import { SkyBox } from "../mvp/components/Skybox";
import { FallingCrocsGame } from "../crocs/components/FallingCrocsGame";
import TestCamera from "./TestCamera";
import CustomiserCamera from "../crocs/components/CustomiserCamera";
// import { ControllableCamera } from "./CameraControlUI";
import useCrocs from "@/hooks/useCrocs";
import { CameraControlUI } from "./CameraControlUI";
import BasicOrbitControls from "../BasicOrbitControls";
import CameraControlPan from "../CameraControlPan";
import { Crocs_hoshi } from "../crocs/models/Crocs_hoshi";
import { Crocs_hoshi_reduced } from "../crocs/models/Crocs_hoshi_reduced";

export const Experience = ({ setIntersection, isMobile }) => {
  const { camera, scene } = useThree();

  const {
    watchPlayerManipulation,
    ecctrlProps,
    bgSound,
    setEcctrlRigidBody,
    setScene,
    setCamera,
    camAnimatedRotation,
    setCamAnimatedRotation,
  } = useXyber();

  const { camOrbitCenter, camDistance, camHeight, camLookAngle, crocsCustomiser, cameraNear } = useCrocs();

  const { addSound, playSound, pauseSound } = useSoundManager();

  const [selectedLevel, setSelectedLevel] = useState("launchpadTest");
  const [pausedPhysics, setPausedPhysics] = useState(true);
  const [environment, setEnvironment] = useState("1");
  const [freeCameraControls, setFreeCameraControls] = useState(false);

  const worldPos = useRef(new THREE.Vector3(0, 0, 0));

  //* Refs =======================
  const ecctrlRef = useRef();
  const cameraRef = useRef();
  const camOrbitGroupRef = useRef();

  // Initializer
  function initializeEcctrl() {
    console.log("Initializing Ecctrl", ecctrlRef.current);
    setEcctrlRigidBody(ecctrlRef.current);
  }

  // Camera Initial Orbit Controls
  useEffect(() => {
    setScene(scene);
    setCamera(camera);
      // Camera start position initialization ---
      if (isMobile && !crocsCustomiser) {
        camera.position.set(0,60,470);
        camera.lookAt(-209.32593267123033, 155.71270760563941, -28.386689708965758);
      } else {
        if (!crocsCustomiser) {
          camera.position.set(0, 60, 260);
          camera.lookAt(-209.32593267123033, 155.71270760563941, -28.386689708965758);

      }
    }
  }, [scene, camera]);



//Camera Orbit and Rotation speed
  useFrame(() => {
    if (camAnimatedRotation) {
      if (camAnimatedRotation == "orbit") {
        const camOrbitGroup = camOrbitGroupRef.current;
        camOrbitGroup.rotation.y += 0.005;
      }
      if (camAnimatedRotation == "rotate") {
        const cam = cameraRef.current;
        cam.rotation.y += 0.005;
      }
    }
  });

  //* Sounds =======================
  useEffect(() => {
    async function addAndPlaySounds() {
      await addSound("BG_Weather", "/bg_weather.mp3");
      // await addSound("songMissingYou", "/songMissingYou.mp3");
      // await addSound("portalTravel", "/sounds/launchpad2.wav");
      // await addSound("wind", "/sounds/wind.wav");

      // Ensure bgSound is checked after sounds are added
      if (bgSound) {
        playSound("BG_Weather", 0.3, true);
      } else {
        pauseSound("BG_Weather");
      }
    }
    addAndPlaySounds();
  }, [bgSound]);

  /* Manually trigger a single jump when using islandHop launch pad */
  function triggerJump() {
    const event = new KeyboardEvent("keydown", {
      key: " ",
      code: "Space",
      keyCode: 32,
      charCode: 32,
      bubbles: true,
      cancelable: true,
    });

    const keyUpEvent = new KeyboardEvent("keyup", {
      key: " ",
      code: "Space",
      keyCode: 32,
      charCode: 32,
      bubbles: true,
      cancelable: true,
    });

    document.dispatchEvent(event);
    setTimeout(() => document.dispatchEvent(keyUpEvent), 500);
  }



  useEffect(() => {
    const timeout = setTimeout(() => {
      setPausedPhysics(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  //* Player Manipulation =======================

  function movePlayer(position) {
    //console.log("Moving player to", position);
    const player = ecctrlRef.current;
    triggerJump();
    player.setNextKinematicTranslation(position);
  }

  useEffect(() => {
    function teleport(position) {
      const player = ecctrlRef.current;
      player.setTranslation({
        x: position[0],
        y: position[1],
        z: position[2],
      });
      player.setRotation({x: 1, y: 3, z: 1});
      player.resetForces();
      player.resetTorques();
    }

    function animatedMove(points, duration) {
      const player = ecctrlRef.current;
      player.setBodyType(2);

      player.resetForces();
      player.resetTorques();
      runAnimation(points, movePlayer, 5000, {
        finalizeFn: () => {
          player.setBodyType(0);
        },
      });
    }

    function applyForceToPlayer(force) {
      const player = ecctrlRef.current;
      player.setGravityScale(1);
      player.applyImpulse(force);
    }

    const removeWatch = watchPlayerManipulation((manipulation) => {
      switch (manipulation.type) {
        case "teleport":
          teleport(manipulation.position);

          break;
        case "bounce":
          // console.log("Bouncing");
          break;

        case "islandHop":
          const points = [
            manipulation.startPoint,
            manipulation.midPoint,
            manipulation.endPoint,
          ];
          animatedMove(points, manipulation.duration);
          break;

        case "forcePlayer":
          applyForceToPlayer(manipulation.force);
          break;
      }
    });

    return () => removeWatch();
  }, [watchPlayerManipulation]);

  const keyboardMap = [
    { name: "forward", keys: ["ArrowUp", "KeyW"] },
    { name: "backward", keys: ["ArrowDown", "KeyS"] },
    { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
    { name: "rightward", keys: ["ArrowRight", "KeyD"] },
    { name: "jump", keys: ["Space"] },
    { name: "run", keys: ["Shift"] },
    { name: "action1", keys: ["1"] },
    { name: "action2", keys: ["2"] },
  ];

  const characterURL = "/models/hoshi.glb";

  const animationSet = {
    idle: "Idle",
    walk: "Walk_inplace",
    run: "Run_inplace",
    jump: "Jump",
    jumpIdle: "Falling_inplace",
    jumpLand: "Fell",
    fall: "Falling_inplace",
    action1: "aarw",
    action2: "gun",
  };

  const [cameraData, setCameraData] = useState(null);

  const handleCameraUpdate = (data) => {
    setCameraData(data); // Store the latest camera values
  };

  return (
    <>
      <CameraControlUI  />
      
      <group ref={camOrbitGroupRef} position={[-209.3259582517125, 105.38746398148577, -33.38669013977051]}>
        <PerspectiveCamera
          ref={cameraRef}
          makeDefault
          fov={75}
          aspect={window.innerWidth / window.innerHeight}
          near={cameraNear}
          far={10000}
          position={[0,0,0]}
        />
      </group>

      <TestCamera />
        <Environment
          files="/hdri/morning_racing_circuit_1k.hdr"
          environmentIntensity={0.6}
        />

      <Physics timeStep="vary">
        <Suspense>
          <Bvh>

            <KeyboardControls map={keyboardMap}>
              <Ecctrl ref={ecctrlRef} animated {...ecctrlProps}>
                <EcctrlAnimation
                  characterURL={characterURL}
                  animationSet={animationSet}
                >
                  {/* <Hoshi /> */}
                  {/* <Crocs_hoshi /> */}
                  <Crocs_hoshi_reduced />
                </EcctrlAnimation>
                <CharacterSFX />
              </Ecctrl>
            </KeyboardControls>
          </Bvh>
          <SuspenseLoader loadedFn={() => initializeEcctrl()} />
        </Suspense>
        <LevelLoader level={selectedLevel} isMobile={isMobile} />

      </Physics>
    </>
  );
};

function SuspenseLoader(props) {
  useEffect(() => {
    if (props.loadedFn) props.loadedFn();
  }, []);
  return null;
}
