import React, { useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import useExperience from "../hooks/useExperience";
import { useControls, button } from "leva";

/**
 * BlenderCamera - Sets the active camera to a camera imported from a GLTF/GLB file (e.g., from Blender).
 * @param url - Path to the GLTF/GLB file in public/models (e.g., "scene" for /models/scene.glb)
 * @param cameraName - (Optional) Name of the camera to use (if multiple cameras in the file)
 */

export default function BlenderCamera({
  url,
  cameraName,
}: {
  url: string;
  cameraName?: string;
}) {
  const modelPath = `/models/${url}.glb`;
  const { cameras } = useGLTF(modelPath);
  const { set, camera, scene } = useThree();
  const { activeCamera, setActiveCamera } = useExperience();

  useEffect(() => {
    if (activeCamera !== "blenderCamera") return;
    let importedCamera: THREE.Camera | undefined = undefined;
    if (cameras && cameras.length > 0) {
      if (cameraName) {
        importedCamera = cameras.find((cam: any) => cam.name === cameraName);
      }
      if (!importedCamera) {
        importedCamera = cameras[0];
      }
      if (importedCamera) {
        // Remove debug camera if present
        const debugCamera = scene.children.find(
          (obj) =>
            obj instanceof THREE.PerspectiveCamera && obj.name === "DebugCamera"
        );
        if (debugCamera) {
          scene.remove(debugCamera);
        }
        // Ensure the imported camera is added to the scene
        if (!scene.children.includes(importedCamera)) {
          scene.add(importedCamera);
        }
        // Set imported camera as active in R3F
        // Type assertion to satisfy R3F's set({ camera })
        set({
          camera: importedCamera as unknown as THREE.PerspectiveCamera & {
            manual?: boolean;
          },
        });
        // Wait for next animation frame to log the updated camera
        requestAnimationFrame(() => {
          // Get the latest camera from useThree
          const currentCamera =
            scene.userData.__r3fRoot?.store.getState().camera || camera;
          if (importedCamera) {
            console.log("R3F camera after set (from store):", currentCamera);
            console.log(
              "UUID match?",
              currentCamera.uuid === importedCamera.uuid
            );
          }
        });
        // Logging for debug
        console.log(
          "BlenderCamera: Using imported camera:",
          importedCamera.name || "[unnamed]",
          importedCamera
        );
        console.log("Position:", importedCamera.position);
        console.log("Rotation (Euler):", importedCamera.rotation);
        console.log("Quaternion:", importedCamera.quaternion);
        if ((importedCamera as any).fov) {
          console.log("FOV:", (importedCamera as any).fov);
        }
      }
    } else {
      console.warn("BlenderCamera: No cameras found in GLTF file!", modelPath);
    }
  }, [activeCamera, cameras, cameraName, set, modelPath, scene, camera]);

  useControls("Camera Debug", {
    "Within Blender Cam Log": button(() => {
      // Find the imported camera (same logic as in useEffect)
      let importedCamera: THREE.Camera | undefined = undefined;
      if (cameras && cameras.length > 0) {
        if (cameraName) {
          importedCamera = cameras.find((cam: any) => cam.name === cameraName);
        }
        if (!importedCamera) {
          importedCamera = cameras[0];
        }
      }
      if (importedCamera) {
        console.log("[BlenderCamera Debug] Imported camera:", importedCamera);
        console.log("Position:", importedCamera.position);
        console.log("Rotation (Euler):", importedCamera.rotation);
        console.log("Quaternion:", importedCamera.quaternion);
        if ((importedCamera as any).fov) {
          console.log("FOV:", (importedCamera as any).fov);
        }
      } else {
        console.warn("[BlenderCamera Debug] No imported camera found!");
      }
    }),
  });

  return null; // This component only sets the camera, nothing to render
}
