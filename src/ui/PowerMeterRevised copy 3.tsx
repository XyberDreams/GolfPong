import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import useExperience from "../hooks/useExperience";

// Replace with your actual PNG path
const BALL_IMG = "/golfpong/golfball6.png";

export default function PowerMeterRevised() {
  const [dragY, setDragY] = useState(0);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const startYRef = useRef<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isShot, setIsShot] = useState("default");
  const [pointerAngle, setPointerAngle] = useState(0);
  const [paused, setPaused] = useState(true);
  const { shotType, setShotType } = useExperience();

  // Clamp dragY between 0 and 500, then map to scale between 0.5 and 1.2
  const minScale = 0.8;
  const maxScale = 1;
  const maxDrag = 300;
  const scale =
    minScale + (Math.min(dragY, maxDrag) / maxDrag) * (maxScale - minScale);

  const powerLevel = (pointerAngle + 50) / 90; // 0 (min) to 1 (max)

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

  useEffect(() => {
    if (isDragging) {
      setPaused(false);
    } else {
      setPaused(true);
    }
  }, [isDragging]);

  useEffect(() => {
    if (paused) {
      const shotRef = getShotType(powerLevel);
      if (setShotType) setShotType(shotRef);
      console.log("Shot Type:", shotType);
    }
  }, [paused]);

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
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <motion.div
        className="absolute z-[500] flex flex-col items-center justify-center"
        style={{
          width: 140,
          height: 140,
          left: "50%",
          top: 50,
          transform: "translateX(-50%)",
        }}
        drag
        dragConstraints={{ top: 0, bottom: 5000, left: -5000, right: 5000 }}
        dragElastic={0.2}
        onDragStart={() => setIsDragging(true)}
        onDrag={(event, info) => {
          setOffset({ x: info.offset.x, y: info.offset.y });
          setDragY(info.offset.y);
        }}
        onDragEnd={() => {
          setIsDragging(false);
          setOffset({ x: 0, y: 0 });
          // setX(0);
          // setY(0);
        }}
        animate={{ x: offset.x, y: offset.y }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Golf Ball PNG */}
        <img
          src={BALL_IMG}
          className="pointer-events-none"
          alt="Golf Ball"
          style={{
            width: 90,
            height: 90,
            zIndex: 500,
            position: "absolute",
            left: 25,
            top: 25,
          }}
        />
        <div
          className="font-[800] text-xl"
          style={{
            position: "absolute",
            left: 25, // match ball's left
            top: 25,
            width: 90,
            height: 90,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 4,
            color: "#222",
            //   textShadow: "0 2px 0 #fff, 0 0px 8px #bbb",
            // pointerEvents: "none",
            textAlign: "center",
            flexDirection: "column",
          }}
        >
          <span>PULL</span>
          <span>BACK</span>
        </div>
        {/* Animated Ring */}
        {!isDragging && (
          <svg
            width={140}
            height={140}
            style={{ position: "absolute", left: 0, top: 0, zIndex: 3 }}
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

        {/* Text Overlay */}
      </motion.div>

      {isDragging && (
        <motion.div
          style={{
            position: "absolute",
            left: "50%",
            top: 50,
            transform: "translateX(-50%)",
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
            onClick={() => setPaused(!paused)}
            // disabled={paused}
          >
            Shoot!
          </button>
        </motion.div>
      )}
    </div>
  );
}
