import { useRef, useEffect, Suspense } from "react";
import { KeyboardControls, Bvh } from "@react-three/drei";
import Ecctrl, { EcctrlAnimation } from "ecctrl";
import { Character } from "./Character";
import { Physics } from "@react-three/rapier";
import useExperience from "../../hooks/useExperience";

// import CharacterSFX from "../mvp/gameObjects/CharacterSFX";

// Default keyboard map and animation set

interface CharacterControllerProps {
  characterURL: string;
  onReady?: (ref: any) => void;
  children?: React.ReactNode;
}

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

export function CharacterController({ characterURL, onReady, children }: CharacterControllerProps) {
  const ecctrlRef = useRef();
  const { ecctrlProps, setEcctrlRigidBody, navigationPOV} = useExperience();

  function initializeEcctrl() {
  console.log("Initializing Ecctrl", ecctrlRef.current);
  setEcctrlRigidBody(ecctrlRef.current);
}

  useEffect(() => {
    if (onReady && ecctrlRef.current) onReady(ecctrlRef.current);
  }, [onReady]);

  if (!ecctrlProps) return null;

  return (
    <Suspense>
      <Bvh>
        <KeyboardControls map={keyboardMap}>
          <Ecctrl ref={ecctrlRef} animated {...ecctrlProps}>
            <EcctrlAnimation
              characterURL={characterURL}
              animationSet={animationSet}
            >
                {navigationPOV === "thirdPersonPOV" && <Character />}
              
            </EcctrlAnimation>
          </Ecctrl>
        </KeyboardControls>
      </Bvh>
      <SuspenseLoader loadedFn={() => initializeEcctrl()} />
    </Suspense>
  );
}

function SuspenseLoader(props: {loadedFn?: () => void}) {
  useEffect(() => {
    if (props.loadedFn) props.loadedFn();
  }, []);
  return null;
}
