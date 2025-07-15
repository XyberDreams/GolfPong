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
  const modelPath = `${url}.glb`;
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
        // Cast to PerspectiveCamera for type safety
        const perspectiveCam = importedCamera as THREE.PerspectiveCamera & {
          manual?: boolean;
        };

        // Store original Blender camera values if not already stored
        if (!perspectiveCam.userData.originalPosition) {
          perspectiveCam.userData.originalPosition =
            perspectiveCam.position.clone();
          perspectiveCam.userData.originalRotation =
            perspectiveCam.rotation.clone();
          perspectiveCam.userData.originalQuaternion =
            perspectiveCam.quaternion.clone();
          perspectiveCam.userData.originalFov = perspectiveCam.fov;
        }
        // Reset camera transform to original Blender values
        perspectiveCam.position.copy(perspectiveCam.userData.originalPosition);
        perspectiveCam.rotation.copy(perspectiveCam.userData.originalRotation);
        perspectiveCam.quaternion.copy(
          perspectiveCam.userData.originalQuaternion
        );
        if (perspectiveCam.userData.originalFov) {
          perspectiveCam.fov = perspectiveCam.userData.originalFov;
          perspectiveCam.updateProjectionMatrix();
        }
        // Set imported camera as active in R3F
        perspectiveCam.manual = true;
        set({
          camera: perspectiveCam,
        });
      }
    } else {
      console.warn("BlenderCamera: No cameras found in GLTF file!", modelPath);
    }
  }, [activeCamera, cameras, cameraName, set, modelPath, scene, camera]);

  useControls("Blender Debug", {
    "Log Blender Cam Values": button(() => {
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
        // --- Compute and log the target ---
        // Forward vector in camera space is (0, 0, -1)
        const forward = new THREE.Vector3(0, 0, -1);
        // Apply rotation to forward vector
        forward.applyEuler(importedCamera.rotation);
        // Compute target
        const target = importedCamera.position.clone().add(forward);
        console.log("Computed Target:", target);
      } else {
        console.warn("[BlenderCamera Debug] No imported camera found!");
      }
    }),
  });

  return null; // This component only sets the camera, nothing to render
}
