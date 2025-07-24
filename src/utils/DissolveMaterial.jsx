import * as THREE from "three";
import * as React from "react";
import CSM from "three-custom-shader-material";
import { patchShaders } from "gl-noise";
import { PivotControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { easing } from "maath";

const vertexShader = /* glsl */ `
  varying vec2 custom_vUv;
  varying vec3 custom_vPosition;
  varying vec3 custom_vBoxUv;
  uniform vec3 uBoxMin;
  uniform vec3 uBoxMax;
  void main() {
    custom_vUv = uv;

  }`;

const fragmentShader = patchShaders(/* glsl */ `
  varying vec2 custom_vUv;
  uniform float uThickness;

  uniform vec3 uColor;   
  uniform float uProgress;

  void main() {
    gln_tFBMOpts opts = gln_tFBMOpts(1.0, 0.3, 2.0, 5.0, 1.0, 5, false, false);
    float noise = gln_sfbm(custom_vUv, opts);
    noise = gln_normalize(noise);

    float progress = uProgress;


float alpha = step(progress, noise);
float border = step(progress - uThickness, noise) - alpha;
float finalAlpha = alpha + border;
if (progress < 0.01) finalAlpha = 0.0;
csm_DiffuseColor.a = finalAlpha;
csm_DiffuseColor.rgb = mix(csm_DiffuseColor.rgb, uColor, border);
  }`);

const uniforms = {
  uThickness: { value: 0.1 },
  uColor: { value: new THREE.Color("#eb5a13").multiplyScalar(20) },
  uProgress: { value: 0 },
};

export function DissolveMaterial({
  baseMaterial,
  thickness = 0.1,
  feather = 6,
  color = "#008854",
  intensity = 10,
  duration = 3.2,
  visible = true,
}) {
  React.useLayoutEffect(() => {
    uniforms.uThickness.value = thickness;
    uniforms.uColor.value.set(color).multiplyScalar(intensity);
  }, [feather, thickness, color, intensity]);

  useFrame((_state, delta) => {
    easing.damp(uniforms.uProgress, "value", visible ? 1 : 0, duration, delta);
  });
  return (
    <>
      <CSM
        baseMaterial={baseMaterial}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        toneMapped={false}
        transparent
      />
    </>
  );
}
