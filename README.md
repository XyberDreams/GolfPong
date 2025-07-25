## useVisibilityControl Hook

A reusable React hook for controlling the visibility (and optional fade/delay) of a THREE.Group in a React Three Fiber scene, based on your app state.

### Usage

```tsx
import { useRef } from "react";
import useVisibilityControl from "./hooks/useVisibilityControl";

const groupRef = useRef<THREE.Group>(null);

useVisibilityControl({
  groupRef,
  experienceState, // your current app state (string)
  visibleStates: ["productInfo", "finish"], // states where group is visible
  delayOnStates: ["intro"], // (optional) states to delay show/hide
  delayMs: 1000, // (optional) delay in ms
  delayOn: "hide", // (optional) "hide" or "show" (default: "hide")
  fade: true, // (optional) fade in/out (default: true)
  fadeDuration: 0.5, // (optional) fade duration in seconds (default: 0.5)
});
```

### Parameters

| Prop            | Type                         | Description                              |
| --------------- | ---------------------------- | ---------------------------------------- | --------------------------------------- |
| groupRef        | React.RefObject<THREE.Group> | Ref to the group to control              |
| experienceState | string                       | Current app state                        |
| visibleStates   | string[]                     | States where the group should be visible |
| delayOnStates   | string[] (optional)          | States to delay show/hide                |
| delayMs         | number (optional)            | Delay in ms (default: 1000)              |
| delayOn         | "hide"                       | "show" (optional)                        | Delay on hide or show (default: "hide") |
| fade            | boolean (optional)           | Fade in/out (default: true)              |
| fadeDuration    | number (optional)            | Fade duration in seconds (default: 0.5)  |

### Navigation State Control

You can control the navigation mode (camera/character control) by changing the `navigationPOV` state in your context. There are three options:

- `firstPersonPOV`: First-person camera, follows the character closely.
- `thirdPersonPOV`: Third-person camera, follows the character from behind.
- `oneShotPOV`: Fixed camera for an overview, with slight mouse movement allowed.

**How to switch modes:**

- To switch between first and third person, update the `navigationPOV` state and set `ecctrlRigidBody` to the desired character controller instance.
- To use the one-shot overview, set `navigationPOV` to `oneShotPOV`. No character controller is needed for this mode.

Example:

```tsx
const { navigationPOV, setNavigationPOV, setEcctrlRigidBody } = useExperience();

// Switch to first person
setNavigationPOV("firstPersonPOV");
setEcctrlRigidBody(firstPersonControllerRef.current);

// Switch to third person
setNavigationPOV("thirdPersonPOV");
setEcctrlRigidBody(thirdPersonControllerRef.current);

// Switch to one-shot overview
setNavigationPOV("oneShotPOV");
```

This lets you dynamically change navigation/camera modes in your app.

---

### How it works

- Fades or toggles visibility of the group when `experienceState` changes.
- Optionally delays the visibility change for smoother transitions.
- Only controls visibility/opacity—does not unmount the component.
