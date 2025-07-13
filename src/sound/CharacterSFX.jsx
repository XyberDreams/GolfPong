// import { useGame } from "ecctrl";
import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { useSoundManager } from "../../../hooks/useSoundManager";
import { useGame } from "ecctrl";

const CharacterSFX = () => {
  const curAnimation = useGame((state) => state.curAnimation);
  // const curAnimation = "Idle";
  const { addSound, playSound, stopSound } = useSoundManager();
  const [nowPlaying, setNowPlaying] = useState(null);

  const { camera } = useThree();
  // console.log(
  //   "%c CharacterSFX",
  //   "background: orange; color: white;",
  //   curAnimation
  // );

  // When the component mounts
  useEffect(() => {
    // add sounds
    addSound("walk", "./sounds/walk.wav");
    addSound("run", "./sounds/run.wav");
    addSound("jump", "./sounds/jump.wav");
    addSound("fell", "./sounds/walk.wav");
  }, []);

  // When the animation changes stop the running sound and play the sound of the new animation
  useEffect(() => {
    // console.log("Current Animation", curAnimation);
    // helper function to set the now playing sound
    function setSound(name, loop = false) {
      playSound(name, 0.05, loop);
      setNowPlaying(name);
      // console.log("Now Playing", name);
    }
    // stop the current sound
    const ignoreStates = ["Falling_inplace"];

    if (
      nowPlaying &&
      !ignoreStates.includes(curAnimation) &&
      !(nowPlaying === "fell" && curAnimation === "Idle")
    ) {
      // console.log('%c Stop the current sound', 'background: red; color: white');
      stopSound(nowPlaying);
    }

    // main switch statement to set the sound
    switch (curAnimation) {
      case "Walk_inplace":
        setSound("walk", true);
        break;
      case "Run_inplace":
        setSound("run", true);
        break;
      case "Jump":
        // console.log('jump detected')
        setSound("jump", false);
        break;
      case "Fell":
        setSound("fell", false);
        break;
    }
  }, [curAnimation]);

  return null;
};

export default CharacterSFX;
