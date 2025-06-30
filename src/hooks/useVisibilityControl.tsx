import { useEffect } from "react";
import * as THREE from "three";

type VisibilityControlProps<T extends string> = {
  groupRef: React.RefObject<THREE.Group>;
  experienceState: T;
  visibleStates: T[];
  delayOnStates?: T[];
  delayMs?: number;
  delayOn?: "hide" | "show";
  fade?: boolean;
  fadeDuration?: number; // seconds
};

export default function useVisibilityControl<T extends string>({
  groupRef,
  experienceState,
  visibleStates,
  delayOnStates = [],
  delayMs = 1000,
  delayOn = "hide",
  fade = true,
  fadeDuration = 0.5,
}: VisibilityControlProps<T>) {
  useEffect(() => {
    if (!groupRef.current) return;

    const shouldBeVisible = visibleStates.includes(experienceState);
    const isDelayedState = delayOnStates.includes(experienceState);

    // Helper: fade logic
    const fadeTo = (target: number, duration: number) => {
      groupRef.current!.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          const mats = Array.isArray(mesh.material)
            ? mesh.material
            : [mesh.material];
          mats.forEach((mat) => {
            mat.transparent = true;
            const start = mat.opacity ?? 1;
            const diff = target - start;
            let elapsed = 0;
            const animate = (dt: number) => {
              elapsed += dt;
              const t = Math.min(elapsed / duration, 1);
              mat.opacity = start + diff * t;
              if (t < 1) {
                requestAnimationFrame(() => animate(1 / 60));
              } else {
                mat.opacity = target;
                if (target === 0) groupRef.current!.visible = false;
                else groupRef.current!.visible = true;
              }
            };
            animate(1 / 60);
          });
        }
      });
    };

    
    // Delayed logic
    if (
      isDelayedState &&
      ((delayOn === "hide" && !shouldBeVisible) ||
        (delayOn === "show" && shouldBeVisible))
    ) {
      const timeout = setTimeout(() => {
        if (fade) {
          fadeTo(shouldBeVisible ? 1 : 0, fadeDuration);
        } else {
          groupRef.current!.visible = shouldBeVisible;
        }
      }, delayMs);
      return () => clearTimeout(timeout);
    } else {
      if (fade) {
        fadeTo(shouldBeVisible ? 1 : 0, fadeDuration);
      } else {
        groupRef.current.visible = shouldBeVisible;
      }
    }
  }, [
    experienceState,
    groupRef,
    visibleStates,
    delayOnStates,
    delayMs,
    delayOn,
    fade,
    fadeDuration,
  ]);
}