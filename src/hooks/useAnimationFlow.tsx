import { useEffect, useRef } from "react";

/**
 * Generalized animation flow hook for managing state-based transitions.
 * @param state - The current state (string or enum)
 * @param setState - Function to update the state
 * @param transitionMap - Object mapping transitions to actions:
 *   { "fromState->toState": () => void, ... }
 */
export function useAnimationFlow<T extends string>(
  state: T,
  setState: (s: T) => void,
  transitionMap: Record<string, () => void>
) {
  const lastState = useRef<T | null>(null);

  useEffect(() => {
    if (!state) return;
    const from = lastState.current;
    const to = state;
    if (from && transitionMap[`${from}->${to}`]) {
      transitionMap[`${from}->${to}`]();
    } else if (transitionMap[`*->${to}`]) {
      // fallback for any-to-this-state
      transitionMap[`*->${to}`]();
    }
    lastState.current = state;
  }, [state, transitionMap]);

  // Utility: goToState
  const goToState = (s: T) => setState(s);

  return { goToState };
}

export default useAnimationFlow;