import React, {
  createContext,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import * as THREE from "three";

function lerpCamera(camera, targetPosition, targetRotation, duration) {
  console.log("Camera in Lerp", camera);
  const startPosition = camera.position.clone();
  const startQuarternion = camera.quaternion.clone();
  const startTime = performance.now();
  const euler = new THREE.Euler();
  const targetQuarternion = new THREE.Quaternion().setFromEuler(
    euler.setFromVector3(targetRotation)
  );

  function animate(currentTime) {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1);

    // Use Three.js Vector3.lerp for smooth interpolation
    camera.position.lerpVectors(startPosition, targetPosition, progress);
    camera.quaternion.slerpQuaternions(
      startQuarternion,
      targetQuarternion,
      progress
    );
    camera.needsUpdate = true;
    camera.updateWorldMatrix();
    // Update the camera's lookAt if needed

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
}

// Create the gameContext
export const gameContext = createContext();

export const GameContextProvider = (props) => {
  // ECCTRL STATES =======================

  // Locked Control State
  const lockedState = {
    jumpVel: 0,
    maxVelLimit: 0,
    turnSpeed: 0,
  };

  // Standard State
  const ecctrlDistance = () => {
    if (window.innerWidth <= 1024) return "-5";
    return "-5";
  };
  const standardState = {
    jumpVel: 5,
    maxVelLimit: 13,
    turnVelMultiplier: 0.2,
    sprintMult: 1.75,
    turnSpeed: 15,
    // characterInitDir: -1.5, 
    // camInitRot: { x: 0, y: -1.5},
    camMaxDis: -5,
    accDeltaTime: 8,
    autoBalance: false,
    camZoomSpeed: 100,
    camFollowMult: 11,
    camMoveSpeed: 2,
    camCollision: true,
    camCollisionOffset: 0.7,
    camInitDis: ecctrlDistance(),
    position: [-209.32593267123033, 105.71270760563941, -28.386689708965758],
    floatHeight: 0.07,
    fixedCamRotMult: 1,
    disableFollowCam: true,
  };

  //* GLOBAL STATES =======================
  const [playerProps, setPlayerProps] = useState({ location: "mainIsland" });
  const [ecctrlRigidBody, setEcctrlRigidBody] = useState(null);
  const [scene, setScene] = useState(null);
  const [camera, setCamera] = useState(null);
  const [firstInteraction, setFirstInteraction] = useState(0);
  const [ecctrlProps, setEcctrlProps] = useState(standardState);
  const [controlsActive, setControlsActive] = useState(true);
  const [currentIsland, setCurrentIsland] = useState("homeIsland");
  const playerData = useRef({});
  const playerDataSubs = useRef([]);
  const [camAnimatedRotation, setCamAnimatedRotation] = useState("orbit");
  const [storedCameraData, setStoredCameraData] = useState();
  const [newCameraLocation, setNewCameraLocation] = useState();
  const [activeControl, setActiveControl] = useState(true);
  const [intersection, setIntersection] = useState(false);
  const [portalTravelSound, setPortalTravelSound] = useState(false);
  const [bgSound, setBgSound] = useState(false);
  const [playerRespawn, setPlayerRespawn] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);



  // CHECK FOR FIRST INTERACTION =======================

  useEffect(() => {
    function handleFirstInteraction() {
      if (firstInteraction === 0) {
        setFirstInteraction(1);
        window.removeEventListener("click", handleFirstInteraction);
        window.removeEventListener("touchstart", handleFirstInteraction);
        window.removeEventListener("keydown", handleFirstInteraction);
      }
    }
    window.addEventListener("click", handleFirstInteraction);
    window.addEventListener("touchstart", handleFirstInteraction);
    window.addEventListener("keydown", handleFirstInteraction);
  }, []);

  // function to set the players state by just passing a prop and value
  function setPlayerProp(propName, value) {
    setPlayerProps({
      ...playerProps,
      [propName]: value,
    });
  }

  // these are non React linkable values and dont trigger react rewrites

  const setPlayerData = (propNameOrData, value) => {
    if (typeof propNameOrData === "object") {
      playerData.current = {
        ...playerData.current,
        ...propNameOrData,
      };
    } else playerData.current[propNameOrData] = value;

    notifyPlayerDataSubs();
  };

  const getPlayerData = (propName) => {
    if (propName) return playerData.current[propName];
    return playerData.current;
  };

  // subscribe to the entire playerData object changes
  const watchPlayerData = (callback) => {
    playerDataSubs.current.push(callback);
    // return a remove function
    return () => {
      const index = playerDataSubs.current.indexOf(callback);
      playerDataSubs.current.splice(index, 1);
    };
  };

  // notify all subscribers of the playerData object
  const notifyPlayerDataSubs = () => {
    for (const sub of playerDataSubs.current) {
      sub(playerData.current);
    }
  };

 
  // Lerp Camera To New Location (Initial Orbit)
  useEffect(() => {
    if (!newCameraLocation) return;
    console.log("new camera location", newCameraLocation);
    const { position, rotation, duration } = newCameraLocation;
    lerpCamera(camera, position, rotation, duration);
  }, [newCameraLocation, camera]);

  //* Controls Manipulation =======================

  function setEcctrl(props) {
    setEcctrlProps((oldVal) => {
      return { ...oldVal, ...props };
    });
  }

  function lockControls() {
    setEcctrl(lockedState);
  }

  function unlockControls() {
    setEcctrl(standardState);
  }

  //* Player Manipulation =======================
  // This is similar, outside of react flow
  const playerManipSubs = useRef([]);

  const watchPlayerManipulation = (callback) => {
    playerManipSubs.current.push(callback);
    return () => {
      const index = playerManipSubs.current.indexOf(callback);
      playerManipSubs.current.splice(index, 1);
    };
  };

  const [pageNumber, setPageNumber] = useState(0);
  // when we manipulate the player we pass an object with the manipulation
  const manipulatePlayer = (manipulation) => {
    for (const sub of playerManipSubs.current) {
      sub(manipulation);
    }
  };

  // for if the player is in active control


  //Disable camera
  const freeCamera = () => {
    const commands = {
      disableFollowCam: true,
    };
    setEcctrl(commands);
  };

 
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    
    // Cleanup event listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  

  return (
    <gameContext.Provider
      value={{

        isMobile,
        setIsMobile,

        firstInteraction,
        ecctrlRigidBody,
        setEcctrlRigidBody,
        scene,
        setScene,
        camera,
        setCamera,


        // Camera Logic
        acquireCameraControl,
        releaseCameraControl,
        camAnimatedRotation,
        setCamAnimatedRotation,
        storedCameraData,
        newCameraLocation,
        setNewCameraLocation,
        freeCamera,
        getPotentialCamData,

        controlsActive,
        lockControls,
        unlockControls,
        ecctrlProps,
        setEcctrlProps,
        setEcctrl,

        playerProps,
        setPlayerProp,
        activeControl,
        setActiveControl,

        setPlayerData,
        getPlayerData,
        watchPlayerData,

        watchPlayerManipulation,
        manipulatePlayer,

        intersection,
        setIntersection,

        currentIsland,
        setCurrentIsland,

        portalTravelSound,
        setPortalTravelSound,

        pageNumber,
        setPageNumber,

        bgSound,
        setBgSound,

        playerRespawn,
        setPlayerRespawn,

      }}
    >
      {props.children}
    </gameContext.Provider>
  );
};

export default gameContext;
