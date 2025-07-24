import { useContext } from "react";
import ExperienceContext from "../context/ExperienceContext";

// Map directions to hole priority arrays
const holePriority = {
  left: [0, 3], // top-left, middle-left
  center: [1, 3, 4, 5], // top-center, middle-left, middle-right, bottom
  right: [2, 4], // top-right, middle-right
};

export function useGolfShotLogic() {
  const ctx = useContext(ExperienceContext);
  if (!ctx)
    throw new Error("useGolfShotLogic must be used within ExperienceProvider");
  const { holes, setHoles, playSFX, dissolvingHoles, setDissolvingHoles } = ctx;

  // direction: "left" | "center" | "right"
  function handleShot(direction: "left" | "center" | "right") {
    if (!holes || !setHoles) return { hit: false, holeIdx: null };

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
      }, 4000);

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
