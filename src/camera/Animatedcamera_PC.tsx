import React, { useRef, useEffect, useState } from "react";
import { useGLTF, useAnimations, CameraControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useAnimationFlow } from "../hooks/useAnimationFlow";
import { useControls, button } from "leva";
import useLipstickExperience from "../hooks/useLipstickExperience";
import type CameraControlsType from "camera-controls";
import type { PerspectiveCamera } from "three";
import "@react-three/fiber";

export default function AnimatedCamera_PC() {
  const group = useRef<THREE.Group | null>(null);
  const controlsRef = useRef<CameraControlsType | null>(null);
  const { scene, animations } = useGLTF("/models/camera_test.glb");
  const { mixer } = useAnimations(animations, group);
  const { setCameraBusy } = useLipstickExperience();
  // const { set, camera } = useThree();
  const [controlEnabled, setControlEnabled] = useState(false);
  // const [orbitTarget, setOrbitTarget] = useState(new THREE.Vector3(0, 0, 0));
  const [liveOrbitTarget, setLiveOrbitTarget] = useState(new THREE.Vector3());
  const savedPos = useRef(new THREE.Vector3());
  const savedTarget = useRef(new THREE.Vector3());
  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  // const updateOrbitPoint = (target: THREE.Vector3) => {
  //   if (controlsRef.current) {
  //     controlsRef.current.setOrbitPoint(target.x, target.y, target.z);
  //     controlsRef.current.update(0);
  //   }
  // };

  // useControls({
  //   "Log Other Info": button(() => {
  //     if (!controlsRef.current) return;
  //     const cc = controlsRef.current;

  //     const pos = new THREE.Vector3();
  //     const target = new THREE.Vector3();
  //     controlsRef.current.update(0);

  //     cc.getPosition(pos);
  //     cc.getTarget(target);

  //     console.log("CameraControls position:", pos);
  //     console.log("CameraControls target:", target);
  //   }),
  // });

  // const { posX, posY, posZ, targetX, targetY, targetZ } = useControls(
  //   "Camera Controls",
  //   {
  //     posX: { value: 88, step: 1 },
  //     posY: { value: 111, step: 1 },
  //     posZ: { value: 332, step: 1 },
  //     targetX: { value: 37, step: 1 },
  //     targetY: { value: 51, step: 1 },
  //     targetZ: { value: 218, step: 1 },
  //   }
  // );

  // useControls({
  //   "Switch to Skin Color Selection": button(() => {
  //     if (!controlsRef.current) return;
  //     const cc = controlsRef.current;

  //     cc.setLookAt(58, 60, 420, 85, 51, 260, false);
  //     wait(1000);
  //     cc.setOrbitPoint(43, 51, 238);
  //     cc.update(0);
  //   }),

  //   "Switch To Product Info": button(() => {
  //     if (!controlsRef.current) return;
  //     const cc = controlsRef.current;

  //     cc.setLookAt(44, 60, 355, 45, 55, 209, false);
  //     cc.update(0);
  //   }),
  //   "Switch To Lipstick Color Selection": button(() => {
  //     if (!controlsRef.current) return;
  //     const cc = controlsRef.current;

  //     cc.setLookAt(54, 32, 352, 50, 51, 209, false);
  //     cc.update(0);
  //   }),
  // });

  // useEffect(() => {
  //   if (controlsRef.current) {
  //     controlsRef.current.setLookAt(
  //       posX,
  //       posY,
  //       posZ,
  //       targetX,
  //       targetY,
  //       targetZ,
  //       false
  //     );
  //     controlsRef.current.update(0);
  //   }
  // }, [posX, posY, posZ, targetX, targetY, targetZ]);

  //Set initial camera stuff
  useEffect(() => {
    if (!controlsRef.current) return;
    const cc = controlsRef.current;
    // cc.camera.fov = 38.49206178514203;
    //Temp FOV + near + Far (Change)
    const camera = cc.camera as PerspectiveCamera;

    camera.fov = 38.49206178514203;
    cc.camera.near = 10;
    cc.camera.far = 6000;
    cc.camera.updateProjectionMatrix();
    cc.minAzimuthAngle = -THREE.MathUtils.degToRad(10);
    cc.maxAzimuthAngle = THREE.MathUtils.degToRad(70);
    cc.minPolarAngle = THREE.MathUtils.degToRad(50);
    cc.maxPolarAngle = THREE.MathUtils.degToRad(80);
    cc.minDistance = 250;
    cc.maxDistance = 400;
    cc.draggingSmoothTime = 0.3;

    cc.setPosition(-31, 49, 347, false);
    cc.setTarget(6, 4, -19, false);
    cc.update(0);

    setControlEnabled(true);
  }, []);

  useFrame((_, delta) => {
    mixer?.update(delta);
  });

  // useEffect(() => {
  //   setTimeout(() => {
  //     const cc = controlsRef.current;

  //     const newOrbitTarget = new THREE.Vector3(0, 0, 0);
  //     cc.setOrbitPoint(newOrbitTarget);
  //   }, 5000);
  // }, []);

  useFrame(() => {
    if (controlsRef.current) {
      const temp = new THREE.Vector3();
      controlsRef.current.getTarget(temp);
      setLiveOrbitTarget(temp.clone());
    }
  });

  const cameraActions = {
    playIntro: async () => {
      if (!controlsRef.current) return;
      const cc = controlsRef.current;
      setCameraBusy(true);
      setControlEnabled(false);
      cc.smoothTime = 1;
      cc.setLookAt(290, 152, 168, 6, 4, -19, true).then(() => {
        setCameraBusy(false);
      });

      setControlEnabled(true);
    },
    playProductInfo: async () => {
      if (!controlsRef.current) return;
      const cc = controlsRef.current;
      setCameraBusy(true);
      setControlEnabled(false);
      cc.smoothTime = 0.8;
      await cc.setLookAt(44, 60, 355, 45, 55, 209, true);

      setTimeout(() => {
        cc.maxDistance = cc.minDistance = cc.distance;
        // cc.minDistance = 0;
        // cc.maxDistance = 1000;
        cc.minAzimuthAngle = -Infinity;
        cc.maxAzimuthAngle = Infinity;
        cc.minPolarAngle = THREE.MathUtils.degToRad(60);
        cc.maxPolarAngle = THREE.MathUtils.degToRad(90);
        setControlEnabled(true);
        setCameraBusy(false);
      }, 2000);
    },
    playLipstickColorSelection: async () => {
      if (!controlsRef.current) return;
      const cc = controlsRef.current;
      setCameraBusy(true);
      setControlEnabled(false);
      cc.smoothTime = 0.7;

      cc.setLookAt(23, 136, 401, 45, 61, 209, true);

      setTimeout(() => {
        cc.setLookAt(54, 32, 334, 50, 43, 209, true);
        // setTimeout(() => {
        //   cc.setOrbitPoint(50, 51, 209);
        // }, 2500);
      }, 3000);

      await wait(3000);
      cc.minAzimuthAngle = -Infinity;
      cc.maxAzimuthAngle = Infinity;
      cc.minPolarAngle = Math.PI / 2;
      cc.maxPolarAngle = Math.PI / 2;
      setControlEnabled(true);
      setCameraBusy(false);
    },

    playSkinColorSelection: async () => {
      if (!controlsRef.current) return;
      const cc = controlsRef.current;
      setCameraBusy(true);
      setControlEnabled(false);
      cc.smoothTime = 0.4;
      cc.setFocalOffset(0, 0, 0, false);
      cc.setLookAt(54, 32, 352, 50, 51, 209, true);
      cc.smoothTime = 0.5;
      setTimeout(() => {
        cc.setLookAt(58, 60, 420, 85, 51, 260, true);
      }, 3000);

      // setTimeout(() => {
      //   cc.setLookAt(65, 39, 365, 42, 63, 233, true);
      // }, 3000);
      setTimeout(() => {
        cc.minDistance = 150;
        cc.maxDistance = 200;
        cc.minAzimuthAngle = -Math.PI / 3;
        cc.maxAzimuthAngle = Math.PI / 3;
        cc.minPolarAngle = THREE.MathUtils.degToRad(70);
        cc.maxPolarAngle = THREE.MathUtils.degToRad(100);
      }, 4500);

      await wait(3000);
      setCameraBusy(false);

      setTimeout(() => {
        cc.setOrbitPoint(43, 51, 238);
      }, 3000);
      await wait(1000);
      setControlEnabled(true);
    },
    playTryOn: async () => {
      if (!controlsRef.current) return;
      const cc = controlsRef.current;
      setCameraBusy(true);
      setControlEnabled(false);
      cc.smoothTime = 0.3;
      cc.setLookAt(55, 44, 310, 44, 45, 240, true);

      setTimeout(() => {
        cc.minDistance = 50;
        cc.maxDistance = 100;
        cc.minAzimuthAngle = -Math.PI / 3;
        cc.maxAzimuthAngle = Math.PI / 3;
        cc.minPolarAngle = THREE.MathUtils.degToRad(70);
        cc.maxPolarAngle = THREE.MathUtils.degToRad(100);
        setControlEnabled(true);
      }, 2000);

      await wait(2000);
      setCameraBusy(false);
    },
    returnToIntro: async () => {
      if (!controlsRef.current) return;
      const cc = controlsRef.current;
      setCameraBusy(true);
      setControlEnabled(false);
      cc.smoothTime = 0.3;
      await cc.setLookAt(44, 60, 355, 45, 55, 209, true);

      cc.smoothTime = 0.7;
      setTimeout(() => {
        cc.setLookAt(290, 152, 168, 6, 4, -19, true);
        cc.camera.near = 10;
        cc.camera.far = 6000;
        cc.camera.updateProjectionMatrix();
        cc.minAzimuthAngle = -THREE.MathUtils.degToRad(10);
        cc.maxAzimuthAngle = THREE.MathUtils.degToRad(70);
        cc.minPolarAngle = THREE.MathUtils.degToRad(50);
        cc.maxPolarAngle = THREE.MathUtils.degToRad(80);
        cc.minDistance = 250;
        cc.maxDistance = 400;
        cc.draggingSmoothTime = 0.3;
        setControlEnabled(true);
      }, 3000);
      await wait(3000);
      setCameraBusy(false);
    },

    returnToProductInfo: async () => {
      if (!controlsRef.current) return;
      const cc = controlsRef.current;
      setCameraBusy(true);
      setControlEnabled(false);
      cc.setFocalOffset(0, 0, 0, false);
      cc.smoothTime = 0.7;
      await cc.setLookAt(44, 60, 355, 45, 55, 209, true);

      setTimeout(() => {
        cc.maxDistance = cc.minDistance = cc.distance;
        // cc.minDistance = 0;
        // cc.maxDistance = 1000;
        cc.minAzimuthAngle = -Infinity;
        cc.maxAzimuthAngle = Infinity;
        cc.minPolarAngle = THREE.MathUtils.degToRad(60);
        cc.maxPolarAngle = THREE.MathUtils.degToRad(90);
        setControlEnabled(true);
        setCameraBusy(false);
      }, 2000);
    },

    returnToLipstickColorSelection: async () => {
      if (!controlsRef.current) return;
      const cc = controlsRef.current;
      setCameraBusy(true);
      setControlEnabled(false);
      cc.smoothTime = 0.7;
      // cc.setOrbitPoint(37,51,218);
      cc.setFocalOffset(0, 0, 0, false);
      await cc.setLookAt(54, 32, 334, 50, 43, 209, true).then(() => {
        setCameraBusy(false);
        cc.minAzimuthAngle = -Infinity;
        cc.maxAzimuthAngle = Infinity;
        cc.minPolarAngle = Math.PI / 2;
        cc.maxPolarAngle = Math.PI / 2;

        setControlEnabled(true);
      });
    },

    returnToSkinColorSelection: async () => {
      if (!controlsRef.current) return;
      const cc = controlsRef.current;
      setCameraBusy(true);
      setControlEnabled(false);
      cc.smoothTime = 0.7;
      cc.setLookAt(88, 111, 332, 45, 61, 209, true);
      setTimeout(() => {
        cc.minAzimuthAngle = -Infinity;
        cc.maxAzimuthAngle = Infinity;
        cc.minPolarAngle = THREE.MathUtils.degToRad(60);
        cc.maxPolarAngle = THREE.MathUtils.degToRad(110);
        setControlEnabled(true);
      }, 3000);
      await wait(3000);
      setCameraBusy(false);
    },
  };

  // Track all timeouts for cleanup
  const timeouts = useRef<NodeJS.Timeout[]>([]);

  useAnimationFlow(cameraActions, {});

  return (
    <>
      {/* <mesh position={liveOrbitTarget}>
        <sphereGeometry args={[8, 16, 16]} />
        <meshBasicMaterial color="yellow" />
      </mesh>
      <axesHelper args={[100]} /> */}
      <primitive object={scene} ref={group} />
      <CameraControls ref={controlsRef} enabled={controlEnabled} />
    </>
  );
}
