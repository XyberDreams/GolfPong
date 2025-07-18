import React from "react";
import useExperience from "../hooks/useExperience";

export default function SwingMessage() {
  const { golfSwingState } = useExperience();
  if (golfSwingState === "default") return;
  if (golfSwingState === "successSwing") {
    return (
      <div
        className="absolute uppercase z-50 border-0.5 border-[#F8DF1A] top-0 left-1/2 -translate-x-1/2 text-3xl font-bold text-[#eddf1a] animate-pop"
        style={{
          textShadow: "3px 3px 0 #000",
        }}
      >
        Nice Shot!
      </div>
    );
  }
  if (golfSwingState === "missedSwing") {
    return (
      <div className="absolute z-50 top-0 left-1/2 -translate-x-1/2">
        <div className=" text-4xl font-bold text-[#fff21a] text-shadow-lg/10 animate-pop">
          AIRBALL
        </div>
        <div
          className="text-3xl font-bold stroke-2 stroke-amber-200 text-white text-shadow-lg/10  animate-pop"
          // style={{
          //   WebkitTextStroke: "0.05px #222",
          // }}
        >
          Try Again
        </div>
      </div>
    );
  }
  // Add more states as needed
  return null;
}
