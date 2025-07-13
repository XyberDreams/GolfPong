import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import useExperience from "../hooks/useExperience";
import Soundtrack from "./Soundtrack";

export default function BGSoundToggleIcon() {
  const {
    bgMusicPlaying,
    setBGMusicPlaying,
    isMuted,
    setIsMuted,
    toggleMute,
    playBGMusic,
    pauseBGMusic,
  } = useExperience();

  // Animation settings
  const waveLength = 73; // width of the wave group
  const windowWidth = 24; // width of the visible window

  const handleClick = () => {
    toggleMute();
    if (bgMusicPlaying) {
      pauseBGMusic();
    } else {
      playBGMusic();
    }
  };

  return (
    <>
      <Soundtrack src="/bg_music.mp3" />
      <button
        onClick={handleClick}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          outline: "none",
        }}
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        <svg
          width={windowWidth}
          height={12}
          viewBox={`0 0 ${windowWidth} 12`}
          fill="none"
        >
          <defs>
            <clipPath id="wave-window">
              <rect x="0" y="0" width={windowWidth} height="12" />
            </clipPath>
          </defs>
          <g clipPath="url(#wave-window)">
            {bgMusicPlaying ? (
              <motion.g
                animate={{
                  x: [0, -waveLength / 3], // move left by 1/3 of the wave length
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 1.2,
                  ease: "linear",
                }}
              >
                {/* Repeat the wave path 2x for seamless looping */}
                <path
                  d="M0 6 Q6 0 12 6 T24 6 T36 6 T48 6 T60 6 T72 6"
                  stroke="black"
                  strokeWidth={2}
                  fill="none"
                />
                <path
                  d="M73 6 Q79 0 85 6 T97 6 T109 6 T121 6 T133 6 T145 6"
                  stroke="black"
                  strokeWidth={2}
                  fill="none"
                />
              </motion.g>
            ) : (
              <rect
                x={0}
                y={5}
                width={windowWidth}
                height={2}
                rx={1}
                fill="black"
              />
            )}
          </g>
        </svg>
      </button>
    </>
  );
}
