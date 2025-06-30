import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import useLipstickExperience from "../hooks/useLipstickExperience";
import useAnimationFlow from "../hooks/useAnimationFlow";
import "@react-three/fiber";

const positionsByState = {
  productInfo: new THREE.Vector3(0, 0, 0),
  lipstickColorSelection: new THREE.Vector3(0, 8, 0),
  skinColorSelection: new THREE.Vector3(0, -80, 0),
  tryOn: new THREE.Vector3(0, -80, 0),
};

export default function Backdrop() {
  const { scene } = useGLTF("/models/oulac_backdrop2.glb");
  const backdropRef = useRef<THREE.Group>(null);
  const { experienceState } = useLipstickExperience();

  const startPos = useRef(new THREE.Vector3());
  const targetPos = useRef(new THREE.Vector3());
  const elapsed = useRef(0);
  const duration = useRef(1);

  const delay = useRef(0);
  const delayElapsed = useRef(0);
  const isDelaying = useRef(false);

  const opacityRef = useRef(0);
  const isFadingIn = useRef(false);

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((mat) => {
            mat.transparent = true;
            mat.opacity = 0;
          });
        } else {
          mesh.material.transparent = true;
          mesh.material.opacity = 0;
        }
      }
    });
  }, [scene]);

  useEffect(() => {
    if (experienceState === "productInfo") {
      opacityRef.current = 0;
      isFadingIn.current = true;
    }
  }, [experienceState]);

  type StateKey = keyof typeof positionsByState;

  const moveToState = (
    state: StateKey,
    customDelay = 0,
    customDuration = 1
  ) => {
    if (!backdropRef.current) return;

    if (state === "productInfo" && customDelay > 0) {
      backdropRef.current.visible = false;
    } else {
      backdropRef.current.visible = true;
    }

    startPos.current.copy(backdropRef.current.position);
    targetPos.current.copy(positionsByState[state] || new THREE.Vector3());

    delay.current = customDelay;
    duration.current = customDuration;
    delayElapsed.current = 0;
    elapsed.current = 0;
    isDelaying.current = customDelay > 0;
  };

  useFrame((_, delta) => {
    if (!backdropRef.current) return;

    // Fade-in logic
    if (isFadingIn.current) {
      opacityRef.current = Math.min(opacityRef.current + delta / 5, 1); // 5.5s fade
      backdropRef.current.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.material instanceof THREE.Material) {
            mesh.material.opacity = opacityRef.current;
          }
        }
      });
      if (opacityRef.current >= 1) {
        isFadingIn.current = false;
      }
    }

    // Handle delay
    if (isDelaying.current) {
      delayElapsed.current += delta;
      if (delayElapsed.current >= delay.current) {
        isDelaying.current = false;
        backdropRef.current.visible = true;
        elapsed.current = 0;
      }
      return;
    }

    // Position lerp
    elapsed.current += delta;
    const t = Math.min(elapsed.current / duration.current, 1);
    backdropRef.current.position.lerpVectors(
      startPos.current,
      targetPos.current,
      t
    );
  });

  useEffect(() => {
    if (experienceState === "productInfo") {
      moveToState("productInfo", 0, 4);
    } else if (experienceState === "lipstickColorSelection") {
      moveToState("lipstickColorSelection", 0, 1.5);
    } else if (experienceState === "skinColorSelection") {
      moveToState("skinColorSelection", 0, 1.5);
    } else if (experienceState === "tryOn") {
      moveToState("tryOn", 0, 1);
    }
  }, [experienceState]);

  const modelActions = {
    playProductInfo: () => {
      isFadingIn.current = true; // enable fade
      opacityRef.current = 0;
      moveToState("productInfo", 0, 4);
    },
    returnToProductInfo: () => {
      isFadingIn.current = false; // no fade
      // Ensure opacity is 1 immediately
      backdropRef.current?.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((mat) => {
              mat.opacity = 1;
              mat.transparent = false; // Disable transparency
            });
          } else if (mesh.material) {
            mesh.material.opacity = 1;
            mesh.material.transparent = false; // Disable transparency
          }
        }
      });
      moveToState("productInfo", 0, 2);
    },
    playLipstickColorSelection: () =>
      moveToState("lipstickColorSelection", 0, 1.5),
    returnToLipstickColorSelection: () => moveToState("productInfo", 0, 2),
    playSkinColorSelection: () => moveToState("skinColorSelection", 0, 1.5),
    returnTpSkinColorSelection: () =>
      moveToState("lipstickColorSelection", 0, 2),
  };

  useAnimationFlow(modelActions, {});

  return experienceState !== "intro" && experienceState !== "none" ? (
    <primitive ref={backdropRef} object={scene} receiveShadow />
  ) : null;
}
