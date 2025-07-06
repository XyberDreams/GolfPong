import { useEffect, useRef } from "react";

/**
 * useTimeout - Run a callback after a specified delay (ms), with automatic cleanup.
 * @param callback Function to run after the delay
 * @param delay Delay in milliseconds (number or null to disable)
 */
export function useTimeout(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  // Remember the latest callback if it changes
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;
    const id = setTimeout(() => savedCallback.current(), delay);
    return () => clearTimeout(id);
  }, [delay]);
}
