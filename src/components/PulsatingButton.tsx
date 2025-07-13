import React from "react";

interface PulsatingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pulseColor?: string;
  duration?: string;
  pulseSpread?: string;
}

export const PulsatingButton = React.forwardRef<
  HTMLButtonElement,
  PulsatingButtonProps
>(
  (
    {
      className,
      children,
      pulseColor,
      duration = "1.5s",
      pulseSpread, 
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={`absolute flex cursor-pointer items-center justify-center rounded-lg bg-primary py-2 text-center text-primary-foreground ${
          className ?? ""
        }`}
        style={
          {
            "--pulse-color": pulseColor,
            "--duration": duration,
            "--pulse-spread": pulseSpread ?? "8px",
          } as React.CSSProperties
        }
        {...props}
      >
        <div className="relative z-10">{children}</div>
        <div
          className="absolute left-1/2 top-1/2 size-full -translate-x-1/2 -translate-y-1/2 rounded-lg"
          style={{
            animation: "pulse var(--duration, 1.5s) ease-out infinite",
            backgroundColor: "transparent",
            pointerEvents: "none",
          }}
        />
      </button>
    );
  }
);

PulsatingButton.displayName = "PulsatingButton";
