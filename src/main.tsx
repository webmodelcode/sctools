import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ContentMenu, Popup } from "./components";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Popup />
    <ContentMenu />
  </StrictMode>
);
