/**
 * Entry point for the content script of the Chrome extension.
 * This script injects a React application into the shadow DOM of the current webpage.
 * It is responsible for rendering the `ContentMenu` component and applying the necessary styles.
 *
 * @module ContentScript
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ContentMenu, QuickMessagesMenu } from "./components";

// this kind of import is neccessary for use with shadow dom
import indexcss from "./index_content.css?inline";

// Create a root container for the React application
const root = document.createElement("div");
root.id = "sct-root";
document.body.appendChild(root);

// Attach a shadow DOM to the root container
const host = document.querySelector("#sct-root");
const shadow = host!.attachShadow({ mode: "open" });

// Inject the styles into the shadow DOM
const style = document.createElement("style");
const body = indexcss;
style.textContent = body;
shadow.appendChild(style);

createRoot(shadow).render(
  <StrictMode>
    <div id="sct-shadow-dom">
      <ContentMenu />
      <QuickMessagesMenu />
    </div>
  </StrictMode>
);
