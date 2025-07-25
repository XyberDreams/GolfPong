import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import {
  useCursor,
  MeshPortalMaterial,
  CameraControls,
  Gltf,
  Text,
  Preload,
} from "@react-three/drei";
import { useRoute, useLocation } from "wouter";
import { easing } from "maath";
import { RoundedPlaneGeometry } from "maath/geometry";
import { PulsatingButton } from "../PulsatingButton";

extend({ RoundedPlaneGeometry });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      roundedPlaneGeometry: any;
    }
  }
}

interface FrameProps {
  id: string;
  name: string;
  author: string;
  bg?: string;
  width?: number;
  height?: number;
  children: React.ReactNode;
  [key: string]: any;
}

export const Portal = () => (
  <>
    <Canvas
      flat
      camera={{ fov: 75, position: [0, 0, 20] }}
      eventSource={document.getElementById("root") ?? undefined}
      eventPrefix="client"
    >
      <color attach="background" args={["#f0f0f0"]} />
      <Frame
        id="01"
        name={``}
        author="Silk x Laneige"
        bg="#e4cdac"
        position={[-1.15, 0, 0]}
        rotation={[0, 0.5, 0]}
      >
        <Gltf src="/models/diorama.glb" scale={0.2} position={[-6, -10, -80]} />
      </Frame>
      <Frame id="02" name="" author="Silk x Lulu Lemon">
        <Gltf src="/models/portal_3.glb" position={[0, -2, -3]} />
      </Frame>
      <Frame
        id="03"
        name=""
        author="Silk x Bilionaire Boys Club"
        bg="#d1d1ca"
        position={[1.15, 0, 0]}
        rotation={[0, -0.5, 0]}
      >
        <Gltf src="/models/portal_1.glb" scale={2} position={[0, -0.8, -4]} />
      </Frame>
      <Rig />
      <Preload all />
    </Canvas>
  </>
);

function Frame({
  id,
  name,
  author,
  bg,
  width = 1,
  height = 1.61803398875,
  children,
  ...props
}: FrameProps) {
  const portal = useRef<any>(null);
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/item/:id");
  const [hovered, hover] = useState(false);
  useCursor(hovered);
  useFrame((state, dt) =>
    easing.damp(portal.current, "blend", params?.id === id ? 1 : 0, 0.2, dt)
  );
  return (
    <group {...props}>
      <Text
        fontSize={0.2}
        anchorY="top"
        anchorX="left"
        lineHeight={0.8}
        position={[-0.375, 0.715, 0.01]}
        material-toneMapped={false}
      >
        {name}
      </Text>
      <Text
        fontSize={0.1}
        anchorX="right"
        position={[0.4, -0.659, 0.01]}
        material-toneMapped={false}
      >
        /{id}
      </Text>
      <Text
        fontSize={0.04}
        anchorX="left"
        position={[-0.375, -0.677, 0.01]}
        material-toneMapped={false}
      >
        {author}
      </Text>
      <mesh
        name={id}
        onClick={(e) => (
          e.stopPropagation(), setLocation("/item/" + e.object.name)
        )}
        onPointerOver={(e) => hover(true)}
        onPointerOut={() => hover(false)}
      >
        <roundedPlaneGeometry args={[width, height, 0.1]} />

        <MeshPortalMaterial
          ref={portal}
          events={params?.id === id}
          side={THREE.DoubleSide}
          {...({} as any)}
        >
          <color attach="background" args={[bg ?? "#fff"]} />
          {children}
        </MeshPortalMaterial>
      </mesh>
    </group>
  );
}

function Rig({
  position = new THREE.Vector3(0, 0, 2),
  focus = new THREE.Vector3(0, 0, 0),
}) {
  const controlsRef = useRef<any>(null);
  const { scene } = useThree();
  const [, params] = useRoute("/item/:id");
  useEffect(() => {
    const active = params?.id ? scene.getObjectByName(params.id) : undefined;
    if (active && active.parent) {
      active.parent.localToWorld(position.set(0, 0.5, 0.25));
      active.parent.localToWorld(focus.set(0, 0, -2));
    }
    controlsRef.current?.setLookAt?.(
      ...position.toArray(),
      ...focus.toArray(),
      true
    );
  });
  return (
    <CameraControls
      ref={controlsRef}
      makeDefault
      minPolarAngle={0}
      maxPolarAngle={Math.PI / 2}
    />
  );
}
export function BackButton() {
  const [, params] = useRoute("/item/:id");
  const [, setLocation] = useLocation();
  const isVisible = !!params;
  return (
    <PulsatingButton
      className="fixed top-8 left-8 z-50 px-4 py-2 text-black text-4xl bg-white border border-gray-300 rounded-lg shadow hover:bg-gray-100 font-semibold transition-opacity duration-700"
      pulseColor="#00FF00"
      duration="1.5s"
      style={{
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? "auto" : "none",
      }}
      onClick={() => setLocation("/")}
    >
      &lt; Back
    </PulsatingButton>
  );
}
