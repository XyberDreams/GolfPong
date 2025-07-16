import React from "react";
import LoadModel from "./LoadModel";
import GP_Scene from "./GP_Scene";

const PCExperience = () => {
  return (
    <>
      {/* <LoadModel url="/golfpong/gp_scene" /> */}
      <LoadModel url="/models/test_scene" />
      <GP_Scene />
    </>
  );
};

export default PCExperience;
