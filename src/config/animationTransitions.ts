import { useState } from "react";
import useAnimationFlow from "../hooks/useAnimationFlow";

export const states = [
  "loadingScreen",
  "homeScreen",
  "productAssembly",
  "gameScreen",
  "finishGame",
  "hitHole1",
  "hitHole2",
  "hitHole3",
  "hitHole4",
  "hitHole5",
  "hitHole6",
  "missShort",
  "missLong",
] as const;

export type State = (typeof states)[number];

export const transitionMap: Record<string, () => void> = {
  "loadingScreen->homeScreen": () => { /* fade in home UI */ },
  "homeScreen->productAssembly": () => { /* play assembly animation */ },
  "homeScreen->gameScreen": () => { /* start game intro animation */ },
  "gameScreen->hitHole1": () => { /* play hitHole1 animation */ },
  "gameScreen->hitHole2": () => { /* ... */ },
  "gameScreen->hitHole3": () => { /* play hitHole3 animation */ },
  "gameScreen->hitHole4": () => { /* play hitHole4 animation */},
  "gameScreen->hitHole5": () => { /* play hitHole5 animation */ },
  "gameScreen->hitHole6": () => { /* play hitHole6 animation */ },
 
  "gameScreen->missShort": () => { /* play missShort animation */ },
  "gameScreen->missLong": () => { /* play missLong animation */ },
  "gameScreen->finishGame": () => { /* play finish animation */ },
  "finishGame->homeScreen": () => { /* return to home, reset state */ },
  // Optionally, wildcard transitions:
  "*->finishGame": () => { /* fallback finish animation */ },
};