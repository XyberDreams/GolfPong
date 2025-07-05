import { useControls, button } from "leva";
import useExperience from "../hooks/useExperience";
import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function CameraSwitcher() {
  const { activeCamera, setActiveCamera } = useExperience();
  const {camera} = useThree();
  
  useControls("Camera Switcher", {
    "Blender Camera": button(() => setActiveCamera("blenderCamera")),
    "Camera Manager": button(() => setActiveCamera("presetCamera")),
    "Test Camera": button(() => setActiveCamera("animatedCamera")),
  });

  useEffect(() => {
    if (activeCamera === "blenderCamera") {
      console.log("R3F active camera:", camera);
    }
  }, [activeCamera, camera]);
  return null;
}
