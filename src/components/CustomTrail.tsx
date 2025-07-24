import { createPortal, useFrame, useThree } from "@react-three/fiber";
import * as React from "react";
import {
  ColorRepresentation,
  Group,
  Mesh,
  Object3D,
  Vector2,
  Vector3,
} from "three";
import {
  MeshLineGeometry as MeshLineGeometryImpl,
  MeshLineMaterial,
} from "meshline";

// Type for the settings the trail can use
// These are the main parameters that control the trail's look and behavior
// width: thickness of the trail
// length: how many points the trail keeps
// decay: how fast the trail fades
// local: use local or world positions
// stride: minimum distance between points
// interval: how many frames to wait before adding a new point
//
type Settings = {
  width: number;
  length: number;
  decay: number;
  local: boolean;
  stride: number;
  interval: number;
};

// Props for the Trail component
export type TrailProps = {
  color?: ColorRepresentation;
  attenuation?: (width: number) => number;
  target?: React.RefObject<Object3D>;
} & Partial<Settings>;

// Default values for the settings
const defaults: Partial<Settings> = {
  width: 0.2,
  length: 1,
  decay: 1,
  local: false,
  stride: 0,
  interval: 1,
};

// Helper function to shift a Float32Array left by a number of steps
const shiftLeft = (collection: Float32Array, steps = 1): Float32Array => {
  collection.set(collection.subarray(steps));
  // Fill the end with the last valid position
  const last = collection.slice(
    collection.length - steps - 3,
    collection.length - steps
  );
  for (let i = 0; i < steps; i++) {
    collection.set(last, collection.length - (i + 1) * 3);
  }
  return collection;
};

// Custom hook to manage the trail's points
export function useTrail(target: Object3D, settings: Partial<Settings>) {
  const { length, local, decay, interval, stride } = {
    ...defaults,
    ...settings,
  } as Settings;

  // The points array stores the trail's positions as a flat Float32Array
  const points = React.useRef<Float32Array | null>(
    null
  ) as React.MutableRefObject<Float32Array | null>;
  const [worldPosition] = React.useState(() => new Vector3());

  // When the target or length changes, initialize the points array
  React.useLayoutEffect(() => {
    if (target) {
      points.current = Float32Array.from({ length: length * 10 * 3 }, (_, i) =>
        target.position.getComponent(i % 3)
      );
    }
  }, [length, target]);

  const prevPosition = React.useRef(new Vector3());
  const frameCount = React.useRef(0);
  const stillFrames = React.useRef(0);

  useFrame(() => {
    if (!target) return;
    if (!points.current) return;
    if (frameCount.current === 0) {
      let newPosition: Vector3;
      if (local) {
        newPosition = target.position;
      } else {
        target.getWorldPosition(worldPosition);
        newPosition = worldPosition;
      }

      const moved = newPosition.distanceTo(prevPosition.current) > stride;

      if (frameCount.current === 0) {
        if (moved) {
          stillFrames.current = 0;
          const steps = 1 * decay;
          for (let i = 0; i < steps; i++) {
            shiftLeft(points.current, 3);
            points.current.set(
              newPosition.toArray(),
              points.current.length - 3
            );
          }
          prevPosition.current.copy(newPosition);
        } else {
          stillFrames.current++;
          if (stillFrames.current > 10) {
            shiftLeft(points.current, 3);
          }
        }
      }
    }

    frameCount.current++;
    frameCount.current = frameCount.current % interval;
  });

  return points;
}

// Type for the mesh line geometry
export type MeshLineGeometry = Mesh & MeshLineGeometryImpl;

// The main Trail component
export const CustomTrail = React.forwardRef(function CustomTrail(
  props: React.PropsWithChildren<TrailProps>,
  forwardRef
) {
  const { children } = props;
  const { width, length, decay, local, stride, interval } = {
    ...defaults,
    ...props,
  } as Settings;

  const { color = "hotpink", attenuation, target } = props;

  const size = useThree((s) => s.size);
  const scene = useThree((s) => s.scene);

  const ref = React.useRef<Group>(null!);
  const [anchor, setAnchor] = React.useState<Object3D>(null!);
  const trailPointsRef = React.useRef([]); // or whatever your trail points are

  // Expose clearTrail method
  React.useImperativeHandle(forwardRef, () => ({
    clearTrail: () => {
      if (points.current) {
        // Reset all points to the current anchor position
        const pos = anchor
          ? local
            ? anchor.position
            : anchor.getWorldPosition(new Vector3())
          : new Vector3();
        for (let i = 0; i < points.current.length; i += 3) {
          points.current[i] = pos.x;
          points.current[i + 1] = pos.y;
          points.current[i + 2] = pos.z;
        }
      }
    },
  }));

  // Get the points for the trail
  const points = useTrail(anchor, { length, decay, local, stride, interval });

  // Find the object to follow (either from the target prop or the first child)
  React.useEffect(() => {
    const t =
      target?.current ||
      ref.current.children.find((o) => {
        return o instanceof Object3D;
      });

    if (t) {
      setAnchor(t);
    }
  }, [points, target]);

  // Create the meshline geometry and material
  const geo = React.useMemo(() => new MeshLineGeometryImpl(), []);
  const mat = React.useMemo(() => {
    const m = new MeshLineMaterial({
      lineWidth: 0.1 * width,
      color: color,
      sizeAttenuation: 1,
      resolution: new Vector2(size.width, size.height),
    });

    // Get and apply first <meshLineMaterial /> from children
    let matOverride: React.ReactElement | undefined;
    if (children) {
      if (Array.isArray(children)) {
        matOverride = children.find((child: React.ReactNode) => {
          const c = child as React.ReactElement;
          return typeof c.type === "string" && c.type === "meshLineMaterial";
        }) as React.ReactElement | undefined;
      } else {
        const c = children as React.ReactElement;
        if (typeof c.type === "string" && c.type === "meshLineMaterial") {
          matOverride = c;
        }
      }
    }

    if (typeof matOverride?.props === "object" && matOverride?.props !== null) {
      m.setValues(matOverride.props);
    }

    return m;
  }, [width, color, size, children]);

  // Update the material's resolution when the canvas size changes
  React.useEffect(() => {
    mat.uniforms.resolution.value.set(size.width, size.height);
  }, [size]);

  // Update the geometry's points every frame
  useFrame(() => {
    if (!points.current) return;
    geo.setPoints(points.current, attenuation);
  });

  // Render the meshline as a portal into the main scene
  return (
    <group>
      {createPortal(
        <mesh ref={forwardRef} geometry={geo} material={mat} />,
        scene
      )}
      <group ref={ref}>{children}</group>
    </group>
  );
});
