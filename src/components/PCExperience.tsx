import React from "react";
import LoadModel from "./LoadModel";
import GP_Scene from "./GP_Scene.jsx";
import { GP_Scene2 } from "./Gp_Scene2.jsx";
import { GP_Test } from "./GP_Test.jsx";
import { GP_Ball } from "./Gp_Ball.jsx";
// import TestDissolve from "./Test_Dissolve";
// import GolfBallTrail from "./GolfBallTrail";

const PCExperience = () => {
  return (
    <>
      {/* <LoadModel url="/golfpong/gp_scene" /> */}
      {/* <LoadModel url="/models/test_scene" /> */}
      {/* <TestDissolve /> */}
      {/* <GolfBallTrail/> */}
      <GP_Scene />
      <GP_Ball />

      {/* <GP_Scene2 /> */}

      {/* <LoadModel url="/golfpong/gp_targetmat" /> */}
      {/* <GP_Test /> */}
    </>
  );
};

export default PCExperience;
