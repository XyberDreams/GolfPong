import { useThree } from "@react-three/fiber";
import { useEffect,useMemo } from "react";
import { KTX2Loader } from "three/examples/jsm/Addons.js";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export default function KTX2Support() {
  const { gl } = useThree();

   useMemo(() => {
    const ktx2Loader = new KTX2Loader()
      .setTranscoderPath("/basis/")
      .detectSupport(gl);

    GLTFLoader.prototype.setKTX2Loader?.call(GLTFLoader, ktx2Loader);
  }, [gl]);

  return null;
}