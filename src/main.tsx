/**
 * @file main.tsx
 * @description Entry point for the popup script. This script renders the `Popup` component,
 * which provides the user interface for managing quick messages and other extension settings.
 *
 * @exports
 * - Renders the `Popup` component into the `#root` element of the popup HTML.
 *
 * @example
 * The popup script initializes the React app:
 * ```tsx
 * createRoot(document.getElementById("root")!).render(<Popup />);
 * ```
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
