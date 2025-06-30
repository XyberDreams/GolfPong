import { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

type ActionMap = Record<string, THREE.AnimationAction | undefined>;
type RefMap = React.RefObject<THREE.Group>;

export default function useAnimationHelper(
  actions: ActionMap,
  names: string[],
  refs: RefMap
) {
  const [hoveredMeshName, setHoveredMeshName] = useState<string | null>(null);
  const [pausePoints, setPausePoints] = useState<number[]>([]);
  const [currentPauseIndex, setCurrentPauseIndex] = useState(0);
  const [maxDuration, setMaxDuration] = useState(0);
  const groupRef = useRef<THREE.Group>(null!);
  const justStartedRef = useRef<Record<string, boolean>>({});

  const initMaxDuration = () => {
    names.forEach((name) => {
      const duration = actions[name]?.getClip()?.duration ?? 0;
    });
    const duration = Math.max(
      ...names.map((name) => actions[name]?.getClip()?.duration ?? 0)
    );
    setMaxDuration(duration);
    return duration;
  };

  const playAllClipsAndPause = (
    pausePercents: number | number[] = 50,
    timescale: number = 1
  ) => {
    // console.log('[playAllClipsAndPause] called with pausePercents:', pausePercents, 'timescale:', timescale);
    const duration = initMaxDuration();
    const points = (
      Array.isArray(pausePercents) ? pausePercents : [pausePercents]
    ).map((p) => (p / 100) * duration);
    setPausePoints(points);
    setCurrentPauseIndex(0);

    names.forEach((name) => {
      const action = actions[name];
      if (action) {
        // console.log(`[playAllClipsAndPause] Setting up "${name}" duration: ${action.getClip()?.duration}, timescale: ${timescale}`);
        action.reset();
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true;
        action.setEffectiveTimeScale(timescale);
        action.paused = false;
        action.play();
        justStartedRef.current[name] = true;
      }
    });
  };

  const continueToNextPause = (nextPercent?: number, timescale: number = 1) => {
    // console.log('[continueToNextPause] called with nextPercent:', nextPercent, 'timescale:', timescale);
    let nextPausePoints: number[] = pausePoints;
    if (nextPercent !== undefined && maxDuration > 0) {
      nextPausePoints = [(nextPercent / 100) * maxDuration];
      setPausePoints(nextPausePoints);
      setCurrentPauseIndex(0);
    }

    names.forEach((name) => {
      const action = actions[name];
      if (action) {
        // console.log(`[continueToNextPause] Continuing "${name}" at time: ${action.time}, timescale: ${timescale}`);
        action.setEffectiveTimeScale(timescale);
        action.paused = false;
        action.play();
        justStartedRef.current[name] = true;
      }
    });
  };

  const playReverseFrom = (
    startPercent: number,
    endPercent: number = 0,
    timescale: number = -1.5
  ) => {
    // console.log('[playReverseFrom] called with startPercent:', startPercent, 'endPercent:', endPercent, 'timescale:', timescale);
    names.forEach((name) => {
      const action = actions[name];
      if (!action) return;
      const clipDuration = action.getClip().duration;
      let startTime = Math.min(
        (startPercent / 100) * clipDuration,
        clipDuration - 0.001
      );
      const endTime = (endPercent / 100) * clipDuration;
      // Ensure startTime is always greater than endTime by a small offset
      if (startTime <= endTime) startTime = endTime + 0.01;
      // console.log(
      //   `[playReverseFrom] "${name}" startTime: ${startTime}, endTime: ${endTime}, current time: ${action.time}`
      // );
      action.reset();
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = false;
      action.setEffectiveTimeScale(timescale);
      action.time = startTime;
      action.paused = false;
      action.play();
      justStartedRef.current[name] = true;
      // console.log(`[playReverseFrom] AFTER: "${name}" time: ${action.time}, timescale: ${action.getEffectiveTimeScale()}, playing in reverse from ${startTime.toFixed(2)}s to ${endTime.toFixed(2)}s, duration: ${clipDuration}`);
    });
    setPausePoints(
      names.map((name) => {
        const action = actions[name];
        if (!action) return 0;
        return (endPercent / 100) * action.getClip().duration;
      })
    );
    setCurrentPauseIndex(0);
  };

  const playPartialClip = (start: number, end: number, timescale = 1) => {
    // console.log('[playPartialClip] called with start:', start, 'end:', end, 'timescale:', timescale);
    const duration = initMaxDuration();
    const startTime = (start / 100) * duration;
    const endTime = (end / 100) * duration;

    names.forEach((name) => {
      const action = actions[name];
      if (action) {
        // console.log(`[playPartialClip] "${name}" startTime: ${startTime}, endTime: ${endTime}, timescale: ${timescale}`);
        action.reset();
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true;
        action.setEffectiveTimeScale(timescale);
        action.time = startTime;
        action.paused = false;
        action.play();
      }
    });

    const playDuration = Math.abs((startTime - endTime) / timescale);
    return playDuration * 1000; // in ms
  };

  // Pause logic
  useFrame(() => {
    if (pausePoints.length === 0) return;
    const threshold = pausePoints[currentPauseIndex];
    names.forEach((name) => {
      const action = actions[name];
      if (!action) return;
      const time = action.time ?? 0;
      const timeScale = action.getEffectiveTimeScale() ?? 1;
      // Per-frame log for debugging
      // console.log(`[Frame] "${name}" time: ${time}, timescale: ${timeScale}, threshold: ${threshold}, paused: ${action.paused}`);
      // Skip pause check for the first frame after starting
      if (justStartedRef.current[name]) {
        justStartedRef.current[name] = false;
        return;
      }
      const shouldPause =
        timeScale >= 0 ? time >= threshold : time <= threshold;
      if (shouldPause) {
        // console.log(
    
        //   `[Pause] "${name}" paused at time: ${time}, threshold: ${threshold}, timescale: ${timeScale}`
        // );
        action.paused = true;
      }
    });
    // Check if all actions that should be paused are paused, then advance pause index or clear
    const allPaused = names.every((name) => {
      const action = actions[name];
      if (!action) return true;
      return action.paused;
    });

    if (allPaused) {
      if (currentPauseIndex < pausePoints.length - 1) {
        setCurrentPauseIndex((prev) => prev + 1);
      } else {
        setPausePoints([]);
      }
    }
  });

  // Hover scaling
  useFrame(() => {
    if (!refs.current || !(refs.current instanceof THREE.Object3D)) return;
    refs.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const isHovered = hoveredMeshName === child.name;
        child.scale.lerp(
          new THREE.Vector3(
            isHovered ? 1.05 : 1,
            isHovered ? 1.05 : 1,
            isHovered ? 1.05 : 1
          ),
          0.1
        );
      }
    });
  });

  return {
    groupRef,
    hoveredMeshName,
    setHoveredMeshName,
    playAllClipsAndPause,
    continueToNextPause,
    playReverseFrom,
    playPartialClip,
  };
}
