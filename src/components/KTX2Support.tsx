import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";

export default function KTX2Support({onReady} : {onReady?: () => void}) {
  const gl = useThree((state) => state.gl);

  useEffect(() => {
    const ktx2loader = new KTX2Loader();
    ktx2loader.setTranscoderPath("https://cdn.jsdelivr.net/gh/pmndrs/drei-assets/basis/");
    ktx2loader.detectSupport(gl);
    window.ktx2loader = ktx2loader; // global for loader callbacks
    if (onReady) {
      onReady();
    }
  }, [gl]);

  window.ktx2loader = 123; // Ensure the global is set

  return null;
}