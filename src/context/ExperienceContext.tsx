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

export type NavigationPOV = "thirdPersonPOV" | "firstPersonPOV" | "oneShotPOV";

// Array of all possible CurrentState values for runtime use
export const CurrentStateArray: CurrentState[] = [
  "intro",
  "loading",
  "active",
  "completed",
  "main",
];

export type GolfSwingState = "default" | "noSwing" | "startSwing" | "releaseSwing" | "successSwing" | "missedSwing";

export type ShotType = "default" | "shotShort" | "shotLong" | "shotPerfect";
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
export const thirdPersonPOV = {
  jumpVel: 5,
  maxVelLimit: 2.5,
  turnVelMultiplier: 0.2,
  sprintMult: 2,
  turnSpeed: 15,
  autoBalance: false,
  camCollision: true,
  camCollisionOffset: 0.7,
  camInitDis: ecctrlDistance(),
};

const firstPersonPOV = {
  camCollision: false,
  camInitDis: -0.01,
  camMinDis: -0.01,
  camFollowMult: 1000,
  camLerpMult: 1000,
  turnVelMultiplier: 1,
  turnSpeed: 100,
  mode: "CameraBasedMovement",
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
  ecctrlRigidBody: unknown | null;
  setEcctrlRigidBody: React.Dispatch<React.SetStateAction<unknown | null>>;
  navigationPOV: NavigationPOV;
  setNavigationPOV: React.Dispatch<React.SetStateAction<NavigationPOV>>;

  //SOUND
  bgMusicPlaying: boolean;
  setBGMusicPlaying: (playing: boolean) => void;
  playBGMusic: () => void;
  pauseBGMusic: () => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  toggleMute: () => void;
  playSFX: (name: string) => void;

  //GOLF SPECIFIC LOGIC
  golfSwingState: GolfSwingState;
  setGolfSwingState: React.Dispatch<React.SetStateAction<GolfSwingState>>;
  shotType?: ShotType;
  setShotType?: React.Dispatch<React.SetStateAction<ShotType>>;
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
  const [ecctrlProps, setEcctrlProps] = useState(thirdPersonPOV);
  const [ecctrlRigidBody, setEcctrlRigidBody] = useState<unknown | null>(null);
  const [navigationPOV, setNavigationPOV] = useState(
    "thirdPersonPOV" as NavigationPOV
  );

  //GOLF SPECIFIC LOGIC
  const [golfSwingState, setGolfSwingState] = useState<GolfSwingState>("default");
  const [shotType, setShotType] = useState<ShotType>("default");


  //SOUND
  const [bgMusicPlaying, setBGMusicPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const playBGMusic = () => setBGMusicPlaying(true);
  const pauseBGMusic = () => setBGMusicPlaying(false);
  const toggleMute = () => setIsMuted((m) => !m);
  const playSFX = (name: string) => {
    const audio = new Audio(`/sounds/sfx/${name}.wav`);
    audio.volume = 0.5;
    audio.play().catch(() => {});
  };

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
        navigationPOV,
        setNavigationPOV,
        bgMusicPlaying,
        setBGMusicPlaying,
        playBGMusic,
        pauseBGMusic,
        isMuted,
        setIsMuted,
        toggleMute,
        playSFX,
        golfSwingState,
        setGolfSwingState,
        shotType,
        setShotType,
      }}
    >
      {children}
    </ExperienceContext.Provider>
  );
};

export default ExperienceContext;
