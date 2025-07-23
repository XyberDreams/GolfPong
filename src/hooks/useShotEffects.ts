import { useEffect, useState } from "react";
import useExperience from "../hooks/useExperience";
import { SHOT_EVENTS, ShotEventKey } from "../config/shotEvents";

export function useShotEffects() {
  const { holes, lastShot, playSFX, totalStrokes, setTotalStrokes } =
    useExperience();
  if (!holes) return;
  const holesHit = holes.filter((h) => !h).length;
  const holesRemaining = holes.length - holesHit;
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

    setStreak((prev) => {
      const nextStreak = lastShot.hit ? prev + 1 : 0;
      return nextStreak;
    });
    setUiMessage(SHOT_EVENTS[eventKey].message);
    // playSFX?.("hit");
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

  useEffect(() => {
    console.log(
      "%c🔥 STROKES TOTALLL (effect):",
      "color: #ff9100; font-weight: bold;",
      totalStrokes
    );
  }, [totalStrokes]);

  return {
    holesHit,
    streak,
    uiMessage,
    setUiMessage,
    holesRemaining,
  };
}
