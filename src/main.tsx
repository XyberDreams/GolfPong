import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ExperienceProvider } from "./context/ExperienceContext";
import "./mixpanel";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ExperienceProvider>
      <App />
    </ExperienceProvider>
  </StrictMode>
);
