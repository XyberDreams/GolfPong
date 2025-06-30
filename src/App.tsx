import { useState } from "react";
import "./App.css";
import useIsMobile from "./hooks/useIsMobile";

function App() {
  const isMobile = useIsMobile();
  return <>{isMobile ? <>mobile stuff </> : <>PC stuff</>}</>;
}

export default App;
