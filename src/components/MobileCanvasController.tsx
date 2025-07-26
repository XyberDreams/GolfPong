import React from "react";
import { GP_Ball } from "./Gp_Ball.jsx";
import { GP_Scene2 } from "./Gp_Scene2.jsx";
import useExperience from "../hooks/useExperience";
import { GP_MainScene } from "./GP_MainScene.jsx";

const MobileCanvasController = () => {
  const { gpExperienceState, setGpExperienceState } = useExperience();
  return (
    <>
      {gpExperienceState === "gameStart" && (
        <>
          <GP_Ball />
          {/* <GP_Scene2 /> */}
          
        </>
      )}
      <GP_MainScene />
                <GP_Ball />

    </>
  );
};

export default MobileCanvasController;
