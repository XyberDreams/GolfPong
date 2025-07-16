import React, { useState, useRef } from "react";

export default function PowerMeter({ onSelect }: { onSelect: (power: number) => void }) {
  const [power, setPower] = useState(0); // 0-100, current indicator position
  const [running, setRunning] = useState(false);
  const [selected, setSelected] = useState<number | null>(null); // where user clicked
  const [finalFill, setFinalFill] = useState<number | null>(null); // animated fill
  const raf = useRef<number>();
  const fillRaf = useRef<number>();
  const startTime = useRef<number>(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const stopPower = useRef<number | null>(null);

  const BAR_BG_COLOR = "#2b4c1a";
  const BAR_FILL_COLOR = "#4a3fc4";

  // Easing function: easeInSine
  const easeInSine = (t: number) => 1 - Math.cos((t * Math.PI) / 2);

  // Start the swing meter
  const start = () => {
    setSelected(null);
    setFinalFill(null);
    setPower(0);
    setRunning(true);
    setDirection(1);
    stopPower.current = null;
    startTime.current = performance.now();
    animate(performance.now());
  };

  // Animate the indicator up and down ONCE
  const animate = (now: number) => {
    const DURATION = 1500; // ms for up or down
    let elapsed = now - startTime.current;

    if (direction === 1) {
      // Going up
      let t = Math.min(elapsed / DURATION, 1);
      let eased = easeInSine(t);
      setPower(eased * 100);

      if (t < 1) {
        raf.current = requestAnimationFrame(animate);
      } else {
        // Start going down
        setDirection(-1);
        startTime.current = performance.now();
        raf.current = requestAnimationFrame(animate);
      }
    } else {
      // Going down
      let t = Math.min(elapsed / DURATION, 1);
      let eased = 1 - easeInSine(t);
      setPower(eased * 100);

      if (t < 1) {
        raf.current = requestAnimationFrame(animate);
      } else {
        // Finished up and down, now animate the fill if user stopped
        setRunning(false);
        setPower(0);
        if (stopPower.current !== null) {
          setFinalFill(0);
          animateFill(0, stopPower.current);
        }
      }
    }
  };

  // Animate the fill bar up to the selected power
  const animateFill = (from: number, to: number) => {
    const FILL_DURATION = 500; // ms
    const fillStart = performance.now();

    const fillStep = (now: number) => {
      let t = Math.min((now - fillStart) / FILL_DURATION, 1);
      let value = from + (to - from) * t;
      setFinalFill(value);
      if (t < 1) {
        fillRaf.current = requestAnimationFrame(fillStep);
      } else {
        setFinalFill(to);
        setSelected(to);
        onSelect(to);
      }
    };
    fillRaf.current = requestAnimationFrame(fillStep);
  };

  // Stop and record power, but let indicator finish
  const stop = () => {
    if (!running || stopPower.current !== null) return;
    stopPower.current = power;
  };

  // Reset for another swing
  const reset = () => {
    setSelected(null);
    setFinalFill(null);
    setPower(0);
    setRunning(false);
    setDirection(1);
    stopPower.current = null;
    cancelAnimationFrame(raf.current!);
    cancelAnimationFrame(fillRaf.current!);
  };

  // Bar dimensions
  const BAR_HEIGHT = 200;
  const BAR_WIDTH = 32;
  const INDICATOR_HEIGHT = 16;
  const INDICATOR_WIDTH = 10;

  return (
    <div className="absolute z-[500]" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div
        style={{
          position: "relative",
          width: BAR_WIDTH,
          height: BAR_HEIGHT,
          background: BAR_BG_COLOR,
          border: "4px solid #ffe600",
          borderRadius: 8,
          marginBottom: 16,
          boxSizing: "border-box",
        }}
      >
        {/* Dots (static) */}
        {[0.25, 0.5, 0.75].map((pos, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: "50%",
              top: `${pos * 100}%`,
              transform: "translate(-50%, -50%)",
              width: 10,
              height: 10,
              background: "#fff",
              borderRadius: "50%",
              zIndex: 2,
            }}
          />
        ))}

        {/* Power fill (after indicator finishes and user stopped) */}
        {finalFill !== null && (
          <div
            style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              width: "100%",
              height: `${finalFill * 2}px`,
              background: BAR_FILL_COLOR,
              opacity: 0.7,
              zIndex: 1,
              transition: "height 0.2s",
            }}
          />
        )}

        {/* Moving indicator (while running) */}
        {running && (
          <div
            style={{
              position: "absolute",
              left: `calc(50% - ${INDICATOR_WIDTH / 2}px)`,
              width: INDICATOR_WIDTH,
              height: INDICATOR_HEIGHT,
              background: "rgba(255,255,255,0.85)",
              top: `${BAR_HEIGHT - INDICATOR_HEIGHT - (power / 100) * (BAR_HEIGHT - INDICATOR_HEIGHT)}px`,
              borderRadius: 6,
              zIndex: 3,
              boxShadow: "0 0 8px #fff",
            }}
          />
        )}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {!running && finalFill === null && (
          <button  className="bg-red-300 rounded-lg" onClick={start} style={{ padding: "8px 16px" }}>
            Start Swing
          </button>
        )}
        {running && (
          <button onClick={stop} style={{ padding: "8px 16px" }}>
            Stop!
          </button>
        )}
        {finalFill !== null && (
          <button className="bg-red-300" onClick={reset} style={{ padding: "8px 16px" }}>
            Reset
          </button>
        )}
      </div>
      {/* {selected !== null && (
        <div style={{ marginTop: 8, color: "#222" }}>
          Power: <b>{Math.round(selected)}%</b>
        </div>
      )} */}
    </div>
  );
}