import React from "react";
import LoadModel from "./LoadModel";
import GP_Scene from "./GP_Scene.jsx";
import { GP_Scene2 } from "./Gp_scene2.jsx";
import { GP_Test } from "./GP_Test.jsx";
// import TestDissolve from "./Test_Dissolve";
// import GolfBallTrail from "./GolfBallTrail";

const PCExperience = () => {
  return (
    <>
      {/* <LoadModel url="/golfpong/gp_scene" /> */}
      {/* <LoadModel url="/models/test_scene" /> */}
      {/* <TestDissolve /> */}
      {/* <GolfBallTrail/> */}
      {/* <GP_Scene /> */}
      <GP_Scene2 />
      {/* <LoadModel url="/golfpong/gp_targetmat"  onLoaded={scene => {
    const cylinder41 = scene.getObjectByName("Cylinder041");
    if (cylinder41) {
      console.log("Cylinder041 position:", cylinder41.position);
      console.log("Cylinder041 rotation (radians):", cylinder41.rotation);
      console.log("Cylinder041 scale:", cylinder41.scale);
      // If you want as arrays:
      console.log("Cylinder041 position array:", [cylinder41.position.x, cylinder41.position.y, cylinder41.position.z]);
      console.log("Cylinder041 rotation array (radians):", [cylinder41.rotation.x, cylinder41.rotation.y, cylinder41.rotation.z]);
      console.log("Cylinder041 scale array:", [cylinder41.scale.x, cylinder41.scale.y, cylinder41.scale.z]);
    } else {
      console.log("Cylinder041 not found in scene.");
    }
  }}/> */}
      {/* <GP_Test /> */}
    </>
  );
};

export default PCExperience;
