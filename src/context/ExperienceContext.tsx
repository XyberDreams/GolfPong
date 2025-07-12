import { Camera } from "@react-three/fiber";
import React, { createContext, useState } from "react";
import * as THREE from "three";

// Generic types for 3D experience
export type ExperienceStep = string;
export type LightingPreset = string;
export type CameraType =
  | "blenderCamera"
  | "debugCamera"
  | "presetCamera"
  | "animatedCamera";

export type CurrentState =
  | "intro"
  | "loading"
  | "active"
  | "completed"
  | "main";
// Array of all possible CurrentState values for runtime use
export const CurrentStateArray: CurrentState[] = [
  "intro",
  "loading",
  "active",
  "completed",
  "main",
];

// Locked Control State
export const lockedState = {
  jumpVel: 0,
  maxVelLimit: 0,
  turnSpeed: 0,
};

// Standard State
export const ecctrlDistance = () => {
  if (window.innerWidth <= 1024) return "-5";
  return "-5";
};
export const standardState = {
  jumpVel: 5,
  maxVelLimit: 2.5,
  turnVelMultiplier: 0.2,
  sprintMult: 2,
  turnSpeed: 15,
  // characterInitDir: -1.5,
  // camInitRot: { x: 0, y: -1.5},
  // camMaxDis: -5,
  // accDeltaTime: 8,
  autoBalance: false,
  // camZoomSpeed: 100,
  // camFollowMult: 11,
  // camMoveSpeed: 2,
  camCollision: true,
  camCollisionOffset: 0.7,
  camInitDis: ecctrlDistance(),
  // position: [0, 10, 0],
  // floatHeight: 0.07,
  // fixedCamRotMult: 1,
  // disableFollowCam: true,
};

export interface ExperienceContextProps {
  activeCamera: CameraType;
  setActiveCamera: (type: CameraType) => void;
  lighting: LightingPreset;
  setLighting: (preset: LightingPreset) => void;
  currentState: CurrentState;
  setCurrentState: (state: CurrentState) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  controlEnabled?: boolean;
  setControlEnabled?: (enabled: boolean) => void;
  cameraBusy?: boolean;
  setCameraBusy?: (busy: boolean) => void;
  ecctrlProps: any;
  setEcctrlProps: React.Dispatch<React.SetStateAction<any>>;
  ecctrlRigidBody: unknown; // Use a more specific type if you know it (e.g., RapierRigidBody)
  setEcctrlRigidBody: React.Dispatch<React.SetStateAction<unknown>>;
}

const ExperienceContext = createContext<ExperienceContextProps | undefined>(
  undefined
);

export const ExperienceProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [activeCamera, setActiveCamera] = useState<CameraType>("blenderCamera");
  const [lighting, setLighting] = useState<LightingPreset>("day");
  const [currentState, setCurrentState] = useState<CurrentState>("intro");
  const [loading, setLoading] = useState<boolean>(false);
  const [controlEnabled, setControlEnabled] = useState<boolean>(false);
  const [cameraBusy, setCameraBusy] = useState<boolean>(false);
  const [ecctrlProps, setEcctrlProps] = useState(standardState);
  const [ecctrlRigidBody, setEcctrlRigidBody] = useState(null);

  return (
    <ExperienceContext.Provider
      value={{
        activeCamera,
        setActiveCamera,
        lighting,
        setLighting,
        currentState,
        setCurrentState,
        loading,
        setLoading,
        controlEnabled,
        setControlEnabled,
        cameraBusy,
        setCameraBusy,
        ecctrlProps,
        setEcctrlProps,
        ecctrlRigidBody,
        setEcctrlRigidBody,
      }}
    >
      {children}
    </ExperienceContext.Provider>
  );
};

export default ExperienceContext;
