import { useState, useRef, useEffect, useCallback } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

type ActionMap = Record<string, THREE.AnimationAction | undefined>;
type RefMap = React.RefObject<THREE.Group>;

export default function useAnimationHelper(
  actions: ActionMap,
  names: string[],
  refs: RefMap
) {
  const [hoveredMeshName, setHoveredMeshName] = useState<string | null>(null); // Only for external use, not for scaling here
  const [pausePoints, setPausePoints] = useState<number[]>([]);
  const [currentPauseIndex, setCurrentPauseIndex] = useState(0);
  const [maxDuration, setMaxDuration] = useState(0);
  const groupRef = useRef<THREE.Group>(null!);
  const justStartedRef = useRef<Record<string, boolean>>({});

  // Accepts an optional array of target clip names, otherwise uses all names
  const initMaxDuration = (targetNames?: string[]) => {
    const useNames = targetNames || names;
    useNames.forEach((name) => {
      const duration = actions[name]?.getClip()?.duration ?? 0;
    });
    const duration = Math.max(
      ...useNames.map((name) => actions[name]?.getClip()?.duration ?? 0)
    );
    setMaxDuration(duration);
    return duration;
  };

  const playAllClipsAndPause = (
    pausePercents: number | number[] = 50,
    timescale: number = 1,
    clipNames?: string | string[]
  ) => {
    // Use only the target clips for duration calculation
    const targetNames = clipNames
      ? Array.isArray(clipNames)
        ? clipNames
        : [clipNames]
      : names;
    const duration = initMaxDuration(targetNames);
    const points = (
      Array.isArray(pausePercents) ? pausePercents : [pausePercents]
    ).map((p) => (p / 100) * duration);
    setPausePoints(points);
    setCurrentPauseIndex(0);

    targetNames.forEach((name) => {
      const action = actions[name];
      if (action) {
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

  const continueToNextPause = (
    nextPercent?: number,
    timescale: number = 1,
    clipNames?: string | string[]
  ) => {
    let nextPausePoints: number[] = pausePoints;
    if (nextPercent !== undefined && maxDuration > 0) {
      nextPausePoints = [(nextPercent / 100) * maxDuration];
      setPausePoints(nextPausePoints);
      setCurrentPauseIndex(0);
    }
    const targetNames = clipNames
      ? Array.isArray(clipNames)
        ? clipNames
        : [clipNames]
      : names;

    targetNames.forEach((name) => {
      const action = actions[name];
      if (action) {
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

  const playPartialClip = (
    start: number,
    end: number,
    timescale = 1,
    namesOverride?: string[]
  ) => {
    const targetNames = namesOverride || names;

    targetNames.forEach((name) => {
      const action = actions[name];
      if (action) {
        const duration = action.getClip().duration;
        const startTime = (start / 100) * duration;
        const endTime = (end / 100) * duration;

        action.stop();
        action.reset();
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true;
        action.setEffectiveTimeScale(timescale);
        action.time = startTime;
        action.paused = false;
        action.play();

        // Optionally, set a timeout to pause/stop at endTime
      }
    });
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

  // Memoize animation controls for stable references
  const memoizedPlayAllClipsAndPause = useCallback(playAllClipsAndPause, [
    actions,
    names,
  ]);
  const memoizedContinueToNextPause = useCallback(continueToNextPause, [
    actions,
    names,
    pausePoints,
    maxDuration,
  ]);
  const memoizedPlayReverseFrom = useCallback(playReverseFrom, [
    actions,
    names,
    maxDuration,
  ]);
  const memoizedPlayPartialClip = useCallback(playPartialClip, [
    actions,
    names,
    maxDuration,
  ]);

  return {
    groupRef,
    hoveredMeshName,
    setHoveredMeshName,
    playAllClipsAndPause: memoizedPlayAllClipsAndPause,
    continueToNextPause: memoizedContinueToNextPause,
    playReverseFrom: memoizedPlayReverseFrom,
    playPartialClip: memoizedPlayPartialClip,
  };
}
