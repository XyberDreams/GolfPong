import React, { createContext, useState } from "react";
import * as THREE from "three";

// Generic types for 3D experience
export type ExperienceStep = string;
export type LightingPreset = string;

export interface ExperienceContextProps {
  camera: THREE.PerspectiveCamera | null;
  setCamera: (cam: THREE.PerspectiveCamera | null) => void;
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
  const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null);
  const [lighting, setLighting] = useState<LightingPreset>("day");
  const [currentStep, setCurrentStep] = useState<ExperienceStep>("intro");
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <ExperienceContext.Provider
      value={{
        camera,
        setCamera,
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
