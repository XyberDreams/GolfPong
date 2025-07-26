import React, { useEffect, useState } from "react";

const LOADING_DURATION = 3000; // ms

const Loader = ({ isReady }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const percent = Math.min(
        99,
        Math.round((elapsed / LOADING_DURATION) * 99)
      );
      setProgress(percent);
      if (percent >= 99) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isReady && progress < 100) {
      setProgress(100);
      console.log('done')
    }
  }, [isReady]);

  // Ball position calculation
  const ballStart = -20;
  const ballSize = 40;
  const matWidth = window.innerWidth * 0.8;
  const ballLeft = ballStart + (progress / 100) * (matWidth - ballSize);

  if (progress === 100) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[9999] bg-white"
      style={{
        background: "linear-gradient(180deg, #f5f5f7 0%, #e0e0e0 100%)",
      }}
    >
      {/* Loader image centered */}
      <div
        className="relative w-[80%] h-[10%]"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Grass mat */}
        <img
          src="/golfpong/gp_bg.png"
          alt="Grass Loading Bar"
          style={{
            objectFit: "fill",
            position: "absolute",
            zIndex: 1,
          }}
        />
        {/* Golf ball */}
        <img
          src="/golfpong/gp_ball.png"
          alt="Golf Ball"
          className="w-auto h-10 z-[500]"
          style={{
            position: "absolute",
            left: ballLeft,
            zIndex: 2,
            transition: "left 0.03s linear",
            pointerEvents: "none",
          }}
        />
        {/* Percentage above ball */}
        <div
          className="absolute mb-20 font-semibold"
          style={{
            left: ballLeft + ballSize / 2 + 4,
            color: "#6b4f1d",
            zIndex: 3,
            pointerEvents: "none",
          }}
        >
          {progress}% <br />
          <span
            className="ml-2"
            style={{ fontSize: 8, display: "block", marginTop: -4 }}
          >
            ▼
          </span>
        </div>
        {/* Loading text below bar */}
        <div
          className="absolute mt-20 text-xl text-[#6b4f1d] font-semibold"
          style={{
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 3,
            pointerEvents: "none",
          }}
        >
          Loading
        </div>
      </div>
    </div>
  );
};

export default Loader;
