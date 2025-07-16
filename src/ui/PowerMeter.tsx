import React, { useState, useRef, useEffect } from "react";
export default function PowerMeter() {
  const [power, setPower] = useState(0); // 0-100
  const [stoppedPower, setStoppedPower] = useState<number | null>(null);
  const stoppedPowerRef = useRef<number | null>(null);
  const [running, setRunning] = useState(false);
  const runningRef = useRef(false);
  const [showFill, setShowFill] = useState(false);
  const [fillHeight, setFillHeight] = useState(0); // 0-100
  const direction = useRef(1); // 1 for up, -1 for down
  const raf = useRef<number>();
  const fillRaf = useRef<number>();
  const loopCount = useRef(0);

  // Start the animation
  const start = () => {
    setPower(0);
    setStoppedPower(null);
    stoppedPowerRef.current = null;
    setRunning(true);
    runningRef.current = true;
    direction.current = 1;
    loopCount.current = 0;
    setShowFill(false);
    setFillHeight(0);
    animate();
  };

  // Animate the bar up and down in a loop
  const animate = () => {
    setPower((prev) => {
      let next = prev + direction.current * 1.05; // speed
      if (next >= 100) {
        next = 100;
        direction.current = -1;
      } else if (next <= 0) {
        next = 0;
        direction.current = 1;
        loopCount.current += 1;

        // if (stoppedPower !== null) {
        //   setRunning(false);
        //   cancelAnimationFrame(raf.current!);
        //   return next;
        // }

        if (loopCount.current >= 1) {
          console.log("Loop finished, stoppedPower:", stoppedPower);

          // If user clicked stop, animate fill bar
          if (stoppedPowerRef.current !== null) {
            setShowFill(true);
            animateFill(0, stoppedPowerRef.current!);
            console.log("FILLING NOW?, ", showFill);
          }

          setRunning(false);
          runningRef.current = false;
          cancelAnimationFrame(raf.current!);

          return next;
        }
      }
      return next;
    });
    if (runningRef.current) raf.current = requestAnimationFrame(animate);
  };

  const animateFill = (from: number, to: number) => {
    const DURATION = 300; // ms for fill animation
    const startTime = performance.now();

    const step = (now: number) => {
      let t = Math.min((now - startTime) / DURATION, 1);
      let value = from + (to - from) * t;
      setFillHeight(value);
      if (t < 1) {
        fillRaf.current = requestAnimationFrame(step);
      } else {
        setFillHeight(to);
      }
    };
    fillRaf.current = requestAnimationFrame(step);
  };

  // Stop the animation (not used yet)
  const stop = () => {
    setStoppedPower(power);
    stoppedPowerRef.current = power;
  };

  useEffect(() => {
    console.log("Stopped power: ", stoppedPower);
  }, [stoppedPower]);

  // Bar dimensions
  const BAR_HEIGHT = 208; // h-52
  const INDICATOR_HEIGHT = 16;
  const INDICATOR_WIDTH = 10;
  const BORDER_WIDTH = 4;

  // Clean up on unmount
  useEffect(() => {
    return () => {
      cancelAnimationFrame(raf.current!);
      cancelAnimationFrame(fillRaf.current!);
    };
  }, []);

  return (
    <div className="absolute z-[500] flex flex-col items-center">
      <div
        className="relative w-8 h-52 border-4 border-[#ffe600] rounded-lg mb-4 box-border"
        style={{ background: "rgba(43,76,26,0.7)" }}
      >
        {/* Dots (static) */}
        {[0.25, 0.5, 0.75].map((pos, i) => (
          <div
            key={i}
            className="absolute left-1/2 z-20 bg-white rounded-full"
            style={{
              top: `${pos * 100}%`,
              transform: "translate(-50%, -50%)",
              width: 10,
              height: 10,
            }}
          />
        ))}
        {showFill && (
          <div
            className="absolute left-0 bottom-0 w-full z-10 bg-[#4a3fc4] opacity-100 rounded-b-lg transition-all"
            style={{
              height: `${(fillHeight / 100) * BAR_HEIGHT}px`,
            }}
          />
        )}
        {/* Moving indicator */}
        {running && (
          <div
            className="absolute left-1/2 bg-white rounded-md z-30"
            style={{
              width: INDICATOR_WIDTH,
              height: INDICATOR_HEIGHT,
              transform: `translate(-50%, 0)`,
              top: `${
                BORDER_WIDTH + // offset for top border
                (BAR_HEIGHT - INDICATOR_HEIGHT - BORDER_WIDTH * 2) *
                  (1 - power / 100)
              }px`,
              boxShadow: "0 0 8px #fff",
            }}
          />
        )}
      </div>
      <button
        className="bg-red-300 rounded-lg px-4 py-2 hover:cursor-pointer"
        onClick={running ? stop : start}
      >
        {running ? "Stop" : "Start"}
      </button>
    </div>
  );
}
