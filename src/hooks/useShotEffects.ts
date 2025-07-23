import { useEffect, useState } from "react";
import useExperience from "../hooks/useExperience";
import { SHOT_EVENTS, ShotEventKey } from "../config/shotEvents";

export function useShotEffects() {
  const { holes, lastShot, playSFX } = useExperience();
  if (!holes) return;
  const holesHit = holes.filter((h) => !h).length;
  const [streak, setStreak] = useState(0);
  const [uiMessage, setUiMessage] = useState("");

  useEffect(() => {
    if (!lastShot) return;

    let eventKey: ShotEventKey = "Hit";
    let nextStreak = streak;

    if (!lastShot.hit) {
      eventKey = "ShortMiss";
      nextStreak = 0;
    } else {
      nextStreak = streak + 1;
      if (nextStreak === 3) eventKey = "3Streak";
      if (nextStreak === 5) eventKey = "5Streak";
      if (holesHit === holes.length) eventKey = "6Streak";
    }

    setStreak(nextStreak);
    setUiMessage(SHOT_EVENTS[eventKey].message);
    playSFX?.(SHOT_EVENTS[eventKey].sfx);
  }, [lastShot]);

  useEffect(() => {
    if (holesHit === holes.length) {
      setUiMessage(SHOT_EVENTS.GameOver.message);
      playSFX?.(SHOT_EVENTS.GameOver.sfx);
      setStreak(0);
    }
    console.log(
      "%c🏌️‍♂️ holesHit:",
      "color: #00c853; font-weight: bold;",
      holesHit
    );
    console.log("%c🔥 streak:", "color: #ff9100; font-weight: bold;", streak);
    console.log(
      "%c💬 uiMessage:",
      "color: #2962ff; font-weight: bold;",
      uiMessage
    );
  }, [holesHit]);

  return {
    holesHit,
    streak,
    uiMessage,
    setUiMessage,
  };
}
