import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import useExperience from "../hooks/useExperience";
import useGolfShotLogic, { getTargetHole } from "../hooks/useGolfShotLogic";
import { getAnimationName } from "../config/animationMap";
import { useShotEffects } from "../hooks/useShotEffects";
import { ShotResult } from "../context/ExperienceContext"; // adjust path as needed

// Replace with your actual PNG path
const BALL_IMG = "/golfpong/golfball7.png";

export default function PowerMeterRevised() {
  const [dragY, setDragY] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [ballVisible, setBallVisible] = useState(true);

  const startYRef = useRef<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isShot, setIsShot] = useState("default");
  const [pointerAngle, setPointerAngle] = useState(0);
  const [paused, setPaused] = useState(true);
  const {
    shotType,
    setShotType,
    shotDirection,
    setShotDirection,
    setHoles,
    playSFX,
    golfAnimationToPlay,
    setGolfAnimationToPlay,
    setLastShot,
    setTargetIdx,
    dissolvingHoles,
  } = useExperience();
  const { handleShot } = useGolfShotLogic();

  const shotEffects = useShotEffects() || {
    holesHit: 0,
    streak: 0,
    uiMessage: "",
  };
  const { holesHit, streak, uiMessage } = shotEffects;

  // Clamp dragY between 0 and 500, then map to scale between 0.5 and 1.2
  const minScale = 0.3;
  const maxScale = 1.2;
  const maxDrag = 100;
  const maxDragY = 380;
  const scale =
    minScale + (Math.min(dragY, maxDrag) / maxDrag) * (maxScale - minScale);

  const powerLevel = (pointerAngle + 50) / 90; // 0 (min) to 1 (max)
  const [power, setPower] = useState(0);

  const directions = ["left", "center", "right"] as const;
  function getRandomDirection() {
    return directions[Math.floor(Math.random() * directions.length)];
  }

  useEffect(() => {
    if (paused) return; // Skip animation if paused
    let direction = 1;
    let angle = pointerAngle; // Start from current angle
    let raf: number;

    function animate() {
      angle += direction * 1.2; // Adjust speed here
      if (angle >= 50) {
        angle = 50;
        direction = -1;
      } else if (angle <= -50) {
        angle = -50;
        direction = 1;
      }
      setPointerAngle(angle);
      raf = requestAnimationFrame(animate);
    }

    animate();
    return () => cancelAnimationFrame(raf);
  }, [paused]);

  useEffect(() => {
    console.log("DISSOLVING HOLESSSSS: ", dissolvingHoles);
  }, [dissolvingHoles]);

  function getShotType(power: number) {
    if (power < 0.15 || power > 0.85) {
      return "shotLong";
    } else if (
      (power >= 0.6 && power <= 0.85) ||
      (power >= 0.15 && power < 0.5)
    ) {
      return "shotShort";
    } else if (power >= 0.5 && power < 0.6) {
      return "shotPerfect";
    }
    return "default";
  }

  function getShotDirection(x: number): "left" | "center" | "right" {
    if (x < -40) return "right";
    if (x > 40) return "left";
    return "center";
  }

  // useEffect(() => {
  //   console.log("shot direction: ", shotDirection);
  //   console.log("Shot Type:", shotType);
  // }, [shotDirection]);

  // useEffect(() => {
  //   console.log(" Drag X: ", dragX);
  // }, [dragX]);

  useEffect(() => {
    if (isDragging) {
      setPaused(false);
    } else {
      setPaused(true);
    }
  }, [isDragging]);

  const triggerShot = () => {
    setPaused(true);
    setBallVisible(false);

    // Function that returns shotLong, shotShort, or shotPerfect
    const shotType = getShotType(powerLevel);
    // Function that returns left, center, or right
    const direction = getShotDirection(dragX);

    let result: ShotResult | null = null;
    // Result will return {hit: true, holeIdx: number} ; where the number is your last hole it hit if true, and false null if miss
    if (shotType === "shotPerfect") {
      const shotResult = handleShot(direction, powerLevel, dragX);
      // Ensure holeIdx is null if undefined
      const safeResult: ShotResult = {
        hit: shotResult.hit,
        holeIdx:
          typeof shotResult.holeIdx === "number" ? shotResult.holeIdx : null,
      };
      setLastShot?.(safeResult);
      result = safeResult;
      console.log("THIS IS RESULT: ", safeResult);
    } else {
      const missResult: ShotResult = { hit: false, holeIdx: null };
      setTargetIdx?.(null);
      setLastShot?.(missResult);
      console.log("THIS IS RESULT OF MISS: ", missResult);
      result = missResult;
    }

    //Returns the shot e.g., shotPerfect1, shotShort1, shotLong3 etc
    const animationName = getAnimationName({
      direction,
      shotType,
      holeIdx: result ? result.holeIdx : null,
    });

    if (setGolfAnimationToPlay) {
      setGolfAnimationToPlay(animationName ?? "");
    }

    // Reset for next shot
    setTimeout(() => {
      setPaused(false);
      setBallVisible(true); // Show the ball again
      setIsDragging(false); // Hide the power bar overlay
      // playSFX("new_turn");
      setShotDirection?.("default");
    }, 4000); // Reset after 1 second
  };

  function updateTargetIdx(
    direction: "left" | "center" | "right",
    strength: number,
    dragX: number
  ) {
    const idx = getTargetHole(direction, strength, dragX);
    setTargetIdx?.(idx);
  }

  return (
    <div>
      <motion.div
        className="z-[500] flex flex-col items-center justify-center"
        style={{
          width: 140,
          height: 140,
        }}
        drag
        dragSnapToOrigin={true}
        dragConstraints={{ top: 0, bottom: 5000, left: -5000, right: 5000 }}
        dragElastic={0.2}
        onDragStart={() => {
          setIsDragging(true);
          setPower(0);
          // console.log("Power changed:", 0);
        }}
        onDrag={(event, info) => {
          setOffset({ x: info.offset.x, y: info.offset.y });
          setDragY(Math.max(info.offset.y, 0));
          setDragX(info.offset.x);

          // Calculate direction and update context/state
          let direction: "left" | "center" | "right";
          if (info.offset.x < -40) direction = "right";
          else if (info.offset.x > 40) direction = "left";
          else direction = "center";
          setShotDirection?.(direction);

          const newPower = Math.min(Math.max(info.offset.y / maxDragY, 0), 1);
          setPower(newPower);
          updateTargetIdx(direction, newPower, info.offset.x);
          // console.log("Power changed:", newPower);
        }}
        onDragEnd={() => {
          triggerShot();
        }}
        // animate={{ x: offset.x, y: offset.y }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {ballVisible && (
          <>
            <img
              src={BALL_IMG}
              className="pointer-events-none"
              alt="Golf Ball"
              style={{
                width: 90,
                height: 90,
                zIndex: 500,
                // position: "absolute",
              }}
            />

            {!isDragging && (
              <svg width={140} height={140} className="z-[500] absolute">
                <circle
                  cx={70}
                  cy={70}
                  r={60}
                  fill="none"
                  stroke="#000000"
                  strokeWidth={6}
                  strokeDasharray="20 10"
                  style={{
                    animation: "spin 5s linear infinite",
                    transformOrigin: "center",
                  }}
                />
              </svg>
            )}
          </>
        )}
      </motion.div>

      {isDragging && (
        <motion.div
          className="top-[-10%] absolute"
          style={{
            width: 140,
            height: 140,
            zIndex: 1000,
            // pointerEvents: "none",
          }}
          initial={{ scale: minScale }}
          animate={{ scale }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Power Bar Image */}
          <img
            className="pointer-events-none"
            src="/golfpong/power_bar2.png"
            alt="Power Bar"
            style={{
              width: "100%",
              height: "auto",
              position: "absolute",
              left: 0,
              top: 0,
            }}
          />
          {/* SVG Pointer */}
          <motion.div
            className="z-[1000]"
            style={{
              position: "absolute",
              left: "50%",
              transform: `translateX(-50%) rotate(${pointerAngle}deg)`,
              width: 48,
              height: 72,
              pointerEvents: "none",
              transformOrigin: "50% 100%",
            }}
          >
            <svg
              viewBox="-1.6 -1.6 19.20 19.20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="72"
            >
              <path
                d="M6 8L2 8L2 6L8 5.24536e-07L14 6L14 8L10 8L10 16L6 16L6 8Z"
                fill="#000000"
              />
            </svg>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
