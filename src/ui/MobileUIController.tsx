import { useShotEffects } from "../hooks/useShotEffects";
import PowerMeterRevised from "./PowerMeterRevised";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { useExperience } from "../hooks/useExperience";
import MobileUIGame from "./MobileUIGame";

export default function MobileUIController() {
  const {
    playSFX,
    lastShot,
    totalStrokes,
    setTotalStrokes,
    gpExperienceState,
  } = useExperience();

  return (
    <>
      <MobileUIGame />
      {gpExperienceState === "gameStart" && <MobileUIGame />}
    </>
  );
}
