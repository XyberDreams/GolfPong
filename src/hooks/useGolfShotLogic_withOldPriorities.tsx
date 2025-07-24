import { useContext } from "react";
import ExperienceContext from "../context/ExperienceContext";

// Map directions to hole priority arrays
const holePriority = {
  left: [0, 3], // top-left, middle-left
  center: [1, 3, 4, 5], // top-center, middle-left, middle-right, bottom
  right: [2, 4], // top-right, middle-right
};

function getTargetHole(direction: "left" | "center" | "right", strength: number, dragX: number) {
  if (direction === "left") {
    // left: hole 0 (top-left) for strong drag, hole 3 (middle-left) for weak drag
    return strength > 0.5 ? 0 : 3;
  }
  if (direction === "right") {
    // right: hole 2 (top-right) for strong drag, hole 4 (middle-right) for weak drag
    return strength > 0.5 ? 2 : 4;
  }
  if (direction === "center") {
    // center: use both dragX and strength to pick between 1, 3, 4, 5
    if (strength < 0.33) return 5; // middle-left
    if (strength < 0.66) return dragX < 0 ? 3 : 4; // top-center or middle-right
    return 1; // bottom
  }
  return null;
}

export function useGolfShotLogic() {
  const ctx = useContext(ExperienceContext);
  if (!ctx)
    throw new Error("useGolfShotLogic must be used within ExperienceProvider");
  const { holes, setHoles, playSFX, dissolvingHoles, setDissolvingHoles } = ctx;

  // direction: "left" | "center" | "right"
  function handleShot(direction: "left" | "center" | "right", strength: number, dragX: number) {
    if (!holes || !setHoles) return { hit: false, holeIdx: null };

      const targetIdx = getTargetHole(direction, strength, dragX);

    const priorities = holePriority[direction];
    console.log(`Shot direction: ${direction}`);
    console.log("Hole priorities for this shot:", priorities);
    console.log("Current holes state:", holes);

    const availableIdx = priorities.find((idx) => holes[idx]);
    console.log("First available hole index in priorities:", availableIdx);

    if (availableIdx !== undefined) {
      setTimeout(() => {
      if (setDissolvingHoles) setDissolvingHoles(prev => prev.map((d, i) => (i === availableIdx ? false : d)));
      }, 3000);
      // Mark the hole as removed
      setTimeout(() => {
        setHoles((prev) => {
          const updated = prev.map((h, i) => (i === availableIdx ? false : h));
          // if (setDissolvingHoles) setDissolvingHoles(prev => prev.map((d, i) => i === availableIdx ? false : d));
          return updated;
        });
      }, 4500);

      // Optionally play a sound or trigger animation
      //   playSFX?.("hit");
      return { hit: true, holeIdx: availableIdx };
    } else {
      // Missed shot
      playSFX?.("swing2");
      console.log("Missed shot! No available holes in this direction.");
      return { hit: false, holeIdx: null };
    }
  }

  return { handleShot };
}

export default useGolfShotLogic;
