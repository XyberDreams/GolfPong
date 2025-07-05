import { Camera } from "@react-three/fiber";
import React, { createContext, useState } from "react";
import * as THREE from "three";

// Generic types for 3D experience
export type ExperienceStep = string;
export type LightingPreset = string;
export type CameraType = "blenderCamera" | "debugCamera" | "presetCamera"| "animatedCamera";
export type CurrentState = "intro" | "loading" | "active" | "completed"| "main";

export interface ExperienceContextProps {
  activeCamera: CameraType;
  setActiveCamera: (type: CameraType) => void;
  lighting: LightingPreset;
  setLighting: (preset: LightingPreset) => void;
  currentState: ExperienceStep;
  setCurrentState: (step: ExperienceStep) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  controlEnabled?: boolean;
  setControlEnabled?: (enabled: boolean) => void;
  cameraBusy?: boolean;
  setCameraBusy?: (busy: boolean) => void;
}

const ExperienceContext = createContext<ExperienceContextProps | undefined>(
  undefined
);

export const ExperienceProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [activeCamera, setActiveCamera] = useState<CameraType>('blenderCamera');
  const [lighting, setLighting] = useState<LightingPreset>("day");
  const [currentState, setCurrentState] = useState<ExperienceStep>("intro");
  const [loading, setLoading] = useState<boolean>(false);
  const [controlEnabled, setControlEnabled] = useState<boolean>(false);
  const [cameraBusy, setCameraBusy] = useState<boolean>(false);

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
      }}
    >
      {children}
    </ExperienceContext.Provider>
  );
};

export default ExperienceContext;
