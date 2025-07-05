import { Camera } from "@react-three/fiber";
import React, { createContext, useState } from "react";
import * as THREE from "three";

// Generic types for 3D experience
export type ExperienceStep = string;
export type LightingPreset = string;
export type CameraType = "blenderCamera" | "debugCamera" | "presetCamera";

export interface ExperienceContextProps {
  activeCamera: CameraType;
  setActiveCamera: (type: CameraType) => void;
  lighting: LightingPreset;
  setLighting: (preset: LightingPreset) => void;
  currentStep: ExperienceStep;
  setCurrentStep: (step: ExperienceStep) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
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
  const [currentStep, setCurrentStep] = useState<ExperienceStep>("intro");
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <ExperienceContext.Provider
      value={{
        activeCamera,
        setActiveCamera,
        lighting,
        setLighting,
        currentStep,
        setCurrentStep,
        loading,
        setLoading,
      }}
    >
      {children}
    </ExperienceContext.Provider>
  );
};

export default ExperienceContext;
