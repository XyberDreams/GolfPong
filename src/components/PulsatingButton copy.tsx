"use client";

import React from "react";

interface PulsatingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pulseColor?: string;
  duration?: string;
  rounded?: string;
}

export default function PulsatingButton({
  className,
  children,
  pulseColor = "white",
  duration = "1.5s",
  rounded = "rounded-lg",
  ...props
}: PulsatingButtonProps) {
  return (
    <button
      className={`relative text-center cursor-pointer flex justify-center items-center text-white dark:text-black bg-white z-[9999999] ${rounded} ${className}`}
      style={
        {
          "--pulse-color": pulseColor,
          "--duration": duration,
        } as React.CSSProperties
      }
      {...props}
    >
      <div className="relative z-10">{children}</div>
      <div
        className={`absolute top-1/2 h-8 w-8 left-1/2 bg-inherit animate-pulse -translate-x-1/2 -translate-y-1/2 ${rounded}`}
      />
    </button>
  );
}