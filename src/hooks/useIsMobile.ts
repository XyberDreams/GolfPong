import { useState, useEffect } from "react";

export default function useIsMobile(breakpoint: number = 640) {
  const getIsMobile = () => window.innerWidth < breakpoint;
  const [isMobile, setIsMobile] = useState(getIsMobile());

  useEffect(() => {
    const handleResize = () => setIsMobile(getIsMobile());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isMobile;
}