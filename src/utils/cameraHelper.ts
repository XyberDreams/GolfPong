import * as THREE from "three";
import type CameraControls from "camera-controls";
import type { PerspectiveCamera } from "three";

// Types
export interface CameraPreset {
  position: [number, number, number];
  target: [number, number, number];
  fov?: number;
  near?: number;
  far?: number;
  minAzimuthAngle?: number;
  maxAzimuthAngle?: number;
  minPolarAngle?: number;
  maxPolarAngle?: number;
  minDistance?: number;
  maxDistance?: number;
  draggingSmoothTime?: number;
  smoothTime?: number;
  [key: string]: any;
}

export interface TransitionCameraOptions {
  smooth?: boolean;
  setCameraBusy?: (busy: boolean) => void;
  setControlEnabled?: (enabled: boolean) => void;
}

// Lower-level helpers (still exported for flexibility)
export function applyCameraPresetToCamera(
  preset: CameraPreset,
  camera: PerspectiveCamera
) {
  if (preset.fov !== undefined) camera.fov = preset.fov;
  if (preset.near !== undefined) camera.near = preset.near;
  if (preset.far !== undefined) camera.far = preset.far;
  camera.updateProjectionMatrix();
}

export function applyCameraPresetToControls(
  preset: CameraPreset,
  controls: CameraControls
) {
  if (!controls) return;
  if (preset.minAzimuthAngle !== undefined)
    controls.minAzimuthAngle = preset.minAzimuthAngle;
  if (preset.maxAzimuthAngle !== undefined)
    controls.maxAzimuthAngle = preset.maxAzimuthAngle;
  if (preset.minPolarAngle !== undefined)
    controls.minPolarAngle = preset.minPolarAngle;
  if (preset.maxPolarAngle !== undefined)
    controls.maxPolarAngle = preset.maxPolarAngle;
  if (preset.minDistance !== undefined)
    controls.minDistance = preset.minDistance;
  if (preset.maxDistance !== undefined)
    controls.maxDistance = preset.maxDistance;
  if (preset.draggingSmoothTime !== undefined)
    controls.draggingSmoothTime = preset.draggingSmoothTime;
  if (preset.smoothTime !== undefined) controls.smoothTime = preset.smoothTime;
  if (controls.update) controls.update(0);
}

// Helper to get a preset by name and normalize position/target to arrays
export function getCameraPresetByName(
  presets: any[],
  name: string
): CameraPreset | undefined {
  const preset = presets.find((p) => p.name === name);
  if (!preset) return undefined;
  const posArr = preset.position
    ? Array.isArray(preset.position)
      ? preset.position
      : [preset.position.x, preset.position.y, preset.position.z]
    : undefined;
  const targetArr = preset.target
    ? Array.isArray(preset.target)
      ? preset.target
      : [preset.target.x, preset.target.y, preset.target.z]
    : undefined;
  return { ...preset, position: posArr, target: targetArr } as CameraPreset;
}

// Main generic transition helper
export async function transitionCameraToPreset(
  controls: CameraControls,
  presets: any[],
  presetName: string,
  options: TransitionCameraOptions = {}
) {
  const { smooth = true, setCameraBusy, setControlEnabled } = options;

  // Use the helper to get and normalize the preset
  const preset = getCameraPresetByName(presets, presetName);
  if (!preset) return;

  if (setCameraBusy) setCameraBusy(true);
  if (setControlEnabled) setControlEnabled(false);

  applyCameraPresetToCamera(preset, controls.camera as PerspectiveCamera);
  applyCameraPresetToControls(preset, controls);

  if (preset.position && preset.target) {
    await controls.setLookAt(
      preset.position[0],
      preset.position[1],
      preset.position[2],
      preset.target[0],
      preset.target[1],
      preset.target[2],
      smooth
    );
  }

  controls.update(0);

  if (setControlEnabled) setControlEnabled(true);
  if (setCameraBusy) setCameraBusy(false);
}
