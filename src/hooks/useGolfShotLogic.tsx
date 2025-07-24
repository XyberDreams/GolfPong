import { useContext } from "react";
import ExperienceContext from "../context/ExperienceContext";

// Map directions to hole priority arrays
const holePriority = {
  left: [0, 3], // top-left, middle-left
  center: [1, 3, 4, 5], // top-center, middle-left, middle-right, bottom
  right: [2, 4], // top-right, middle-right
};

export function getTargetHole(
  direction: "left" | "center" | "right",
  strength: number,
  dragX: number
) {
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
    if (strength < 0.5) return 5; // middle-left
    if (strength < 0.8) return dragX < 0 ? 3 : 4; // top-center or middle-right
    return 1; // bottom
  }
  return null;
}

export function useGolfShotLogic() {
  const ctx = useContext(ExperienceContext);
  if (!ctx)
    throw new Error("useGolfShotLogic must be used within ExperienceProvider");
  const {
    holes,
    setHoles,
    playSFX,
    dissolvingHoles,
    setDissolvingHoles,
    targetIdx,
    setTargetIdx,
  } = ctx;

  // direction: "left" | "center" | "right"
  function handleShot(
    direction: "left" | "center" | "right",
    strength: number,
    dragX: number
  ) {
    if (!holes || !setHoles) return { hit: false, holeIdx: null };

    // console.log("Target hole index for this shot:", shotIdx);

    // console.log(`Shot direction: ${direction}`);
    // console.log("Target hole index for this shot:", targetIdx);
    // console.log("Current holes state:", holes);

    if (targetIdx !== null) {
      setTimeout(() => {
        if (setDissolvingHoles)
          setDissolvingHoles((prev) =>
            prev.map((d, i) => (i === targetIdx ? false : d))
          );
      }, 3000);

      setTimeout(() => {
        setHoles((prev) => {
          const newHoles = prev.map((h, i) => (i === targetIdx ? false : h));
          // Use newHoles to reset dissolvingHoles
          // if (setDissolvingHoles)
          //   setDissolvingHoles((prevDissolve) =>
          //     prevDissolve.map((d, i) => (newHoles[i] ? true : d))
          //   );
          return newHoles;
        });
        setTargetIdx?.(null);
      }, 4500);

      return { hit: true, holeIdx: targetIdx };
    } else {
      // Missed shot
      playSFX?.("swing2");
      console.log("Missed shot! No available holes in this direction.");
      setTargetIdx?.(null);
      return { hit: false, holeIdx: null };
    }
  }

  return { handleShot };
}

export default useGolfShotLogic;
