import { useControls, button } from "leva";
import useExperience from "../hooks/useExperience";
import { CurrentStateArray } from "../context/ExperienceContext";
import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
// import mixpanel from "../mixpanel";

export default function CameraSwitcher() {
  const { activeCamera, setActiveCamera, setCurrentState } = useExperience();
  const { camera } = useThree();

  useControls("Camera Switcher", {
    "Blender Camera": button(() => {
      setActiveCamera("blenderCamera");
      // mixpanel.track("Button Clicked", { button: "Blender Camera" });
    }),
    "Camera Manager": button(() => {
      setActiveCamera("presetCamera");
      // mixpanel.track("Signup Button Clicked", {
      //   source: "home page",
      //   variety: "default",
      // });
    }),
    "Test Camera": button(() => setActiveCamera("animatedCamera")),
  });

  return null;
}
