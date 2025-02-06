/**
 * Entry point for the popup script of the Chrome extension.
 * This script renders the `Popup` component into the root element of the popup HTML.
 * It is responsible for initializing the React application for the popup UI.
 *
 * @module PopupScript
 * @file main.tsx
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Popup } from "./components";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Popup />
  </StrictMode>
);
