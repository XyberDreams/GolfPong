import { useState } from "react";
import useAnimationFlow from "../hooks/useAnimationFlow";

const states = ["intro", "productInfo", "finish"] as const;
type State = typeof states[number];

const transitionMap = {
  "intro->productInfo": () => { /* play intro to productInfo anim */ },
  "productInfo->intro": () => { /* play reverse anim */ },
  "*->finish": () => { /* play finish anim */ },
};

const { goToState } = useAnimationFlow<State>(currentState, setCurrentState, transitionMap);