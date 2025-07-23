import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import useExperience from "../hooks/useExperience";
import useGolfShotLogic from "../hooks/useGolfShotLogic";
import { getAnimationName } from "../config/animationMap";
import { useShotEffects } from "../hooks/useShotEffects";

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
  } = useExperience();
  const { handleShot } = useGolfShotLogic();
  const { holesHit, streak, uiMessage } = useShotEffects();

  // Clamp dragY between 0 and 500, then map to scale between 0.5 and 1.2
  const minScale = 0.2;
  const maxScale = 1;
  const maxDrag = 300;
  const scale =
    minScale + (Math.min(dragY, maxDrag) / maxDrag) * (maxScale - minScale);

  const powerLevel = (pointerAngle + 50) / 90; // 0 (min) to 1 (max)

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
      angle += direction * 0.7; // Adjust speed here
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

  function getShotDirection(x: number) {
    if (x < -40) {
      if (setShotDirection) setShotDirection("right");
    } // Dragged left, shoot right
    if (x > 40) {
      if (setShotDirection) setShotDirection("left");
    } // Dragged right, shoot left
    if (x >= -40 && x <= 40) {
      if (setShotDirection) setShotDirection("center");
    } // Dragged center, shoot straight
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
    const shotType = getShotType(powerLevel);
    // if (setShotType) setShotType(shotRef);

    let direction: "left" | "center" | "right";
    if (dragX < -40) direction = "right";
    else if (dragX > 40) direction = "left";
    else direction = "center";

    const result = handleShot(direction);

    setLastShot?.(result);

    const animationName = getAnimationName({
      direction,
      shotType,
      holeIdx: result.holeIdx,
    });

    if (setGolfAnimationToPlay) {
      setGolfAnimationToPlay(animationName ?? "");
    }
  };

  // function onPointerDown(e: PointerEvent) {
  //   setIsDragging(true);
  //   startYRef.current = e.clientY;
  //   window.addEventListener("pointermove", onPointerMove);
  //   window.addEventListener("pointerup", onPointerUp);
  // }

  // function onPointerMove(e: PointerEvent) {
  //   if (startYRef.current === null) return;

  //   const deltaY = e.clientY - startYRef.current;
  //   if (deltaY < 0) {
  //     console.log("Pulling back");
  //     setDragY(0);
  //   } else {
  //     setDragY(Math.min(deltaY, 500));
  //     console.log("Dragging down:", deltaY);
  //   }
  // }

  // function onPointerUp(e: PointerEvent) {
  //   setIsDragging(false);
  //   startYRef.current = null;
  //   window.removeEventListener("pointermove", onPointerMove);
  //   window.removeEventListener("pointerup", onPointerUp);

  //   console.log("Released with dragY:", dragY);
  // }

  return (
    <div >
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
        onDragStart={() => setIsDragging(true)}
        onDrag={(event, info) => {
          setOffset({ x: info.offset.x, y: info.offset.y });
          setDragY(info.offset.y);
          setDragX(info.offset.x);

          // Calculate direction and update context/state
          let direction: "left" | "center" | "right";
          if (info.offset.x < -40) direction = "right";
          else if (info.offset.x > 40) direction = "left";
          else direction = "center";
          setShotDirection?.(direction);
        }}
        onDragEnd={() => {
          triggerShot();
          setBallVisible(false);

          // Determine direction from dragX
          let direction: "left" | "center" | "right";
          if (dragX < -40) {
            direction = "right";
            setShotDirection?.("right");
          } else if (dragX > 40) {
            direction = "left";
            setShotDirection?.("left");
          } else {
            direction = "center";
            setShotDirection?.("center");
          }

          const currentShotType = getShotType(powerLevel);

          if (currentShotType === "shotPerfect") {
            const result = handleShot(direction);
            console.log("Shot result:", result);
          } else {
            console.log("Shot type not perfect, no shot taken");
          }
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
              <svg
                width={140}
                height={140}
                className="z-[500] absolute"
              >
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
        className="top-0 absolute"
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
          <div style={{ position: "absolute", top: 0, left: 0, color: "#000" }}>
            Power: {powerLevel.toFixed(2)}
          </div>

          <button
            className="z-[5000] hover:cursor-pointer"
            style={{
              position: "absolute",
              left: "50%",
              top: 220,
              transform: "translateX(-50%)",
              padding: "10px 24px",
              fontWeight: 700,
              fontSize: 18,
              background: "#ff0",
              border: "2px solid #222",
              borderRadius: 8,
              cursor: "pointer",
            }}
            onClick={() => {
              setPaused(false);
              setBallVisible(true); // Show the ball again
              setIsDragging(false); // Hide the power bar overlay
              playSFX("new_turn");
              setShotDirection?.("default");
            }}
          >
            Reset!
          </button>
          <button
            style={{
              position: "absolute",
              left: "50%",
              top: 300,
              transform: "translateX(-50%)",
              zIndex: 5000,
              padding: "10px 24px",
              fontWeight: 700,
              fontSize: 18,
              background: "#0ff",
              border: "2px solid #222",
              borderRadius: 8,
              cursor: "pointer",
            }}
            onClick={() => {
              const dir = getRandomDirection();
              const result = handleShot(dir);
              console.log(`Random shot direction: ${dir}`, result);
            }}
          >
            Random Shot
          </button>
          <button
            style={{
              position: "absolute",
              left: "50%",
              top: 360,
              transform: "translateX(-50%)",
              zIndex: 5000,
              padding: "10px 24px",
              fontWeight: 700,
              fontSize: 18,
              background: "#f0f",
              border: "2px solid #222",
              borderRadius: 8,
              cursor: "pointer",
            }}
            onClick={() => {
              setHoles?.([true, true, true, true, true, true]);
            }}
          >
            Reset Holes
          </button>
        </motion.div>
      )}
    </div>
  );
}
