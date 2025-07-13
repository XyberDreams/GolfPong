import { Html } from "@react-three/drei";
import { PulsatingButton } from "./PulsatingButton";
import React from "react";

interface HotspotProps {
  position?: [number, number, number];
  duration?: string; 
  pulseColor?: string;
  className?: string;
  children?: React.ReactNode;
    pulseSpread?: string;
}

export default function Hotspot({ position = [0, 3, 0], duration = "1.5s", pulseColor = "white" }: HotspotProps) {
  return (
    <Html position={position} center zIndexRange={[100, 0]} distanceFactor={40}>
      <div className="relative flex flex-col items-center">
        <PulsatingButton
          className="h-4 w-4 bg-white rounded-full"
          pulseColor={pulseColor}
          duration={duration}
        />
      </div>
    </Html>
  );
}
