import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";

// Hack to get iOS to play sounds in the media state
const clickSound = new Audio("/sounds/mouseSound2.mp3");
clickSound.play().then(() => {
  // this might be needed to stop it
  //clickSound.pause();
});

const sounds = new Map();
let hasInteracted = false;

function handleInteraction() {
  hasInteracted = true;
  // console.log("User interacted with the page");
  clickSound.play().then(() => {
    // this might be needed to stop it
    //clickSound.pause();
  });
  for (const callback of listeners.values()) callback();
  document.removeEventListener("click", handleInteraction);
  document.removeEventListener("touchstart", handleInteraction);
  document.removeEventListener("keydown", handleInteraction);
}
const listeners = new Map();

export const useSoundManager = () => {
  const { camera } = useThree();
  const listener = useRef(new THREE.AudioListener()).current;
  const audioLoader = useRef(new THREE.AudioLoader()).current;
  camera.add(listener);

  useEffect(() => {
    document.addEventListener("click", handleInteraction);
    document.addEventListener("touchstart", handleInteraction);
    document.addEventListener("keydown", handleInteraction);

    return () => {
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
    };
  }, []);

  async function addSound(name: string, url: string) {
    if (sounds.has(name)) return;
    await new Promise((resolve, reject) => {
      audioLoader.load(
        url,
        (buffer) => {
          const sound = new THREE.Audio(listener);
          sound.setBuffer(buffer);
          sounds.set(name, sound);
          // console.log("sound added", name);
          resolve(true);
        },
        undefined,
        reject
      );
    });
  }

  function getSound(name: string) {
    return sounds.get(name);
  }

  function playSound(name: string, volume = 0.1, loop = false, duration?: number) {
    const sound = getSound(name);
    if (!sound) return;

    function _play() {
      sound.stop();
      sound.setVolume(volume);
      sound.setLoop(loop);
      sound.play();
    }

    if (duration) {
      setTimeout(() => {
        sound.stop();
      }, duration);
    }

    if (!hasInteracted) listeners.set(name, _play);
    else _play();
  }

  function removeSound(name: string) {
    const sound = getSound(name);
    if (sound) {
      sound.stop();
      sounds.delete(name);
    }
  }

  function pauseSound(name: string) {
    const sound = getSound(name);
    if (sound) sound.pause();
  }

  function stopSound(name: string) {
    const sound = getSound(name);
    if (sound) sound.stop();
  }

  return { addSound, getSound, playSound, removeSound, stopSound, pauseSound };
};
