/**
 * @file content.tsx
 * @description Entry point for the content script. This script is injected into compatibles pages
 * and initializes the Shadow DOM to ensure styles and components don't interfere with the host website.
 *
 * @exports
 * - Attaches a Shadow DOM to the document body.
 * - Renders the `ContentMenu` and `QuickMessagesMenu` components within the Shadow DOM.
 *
 * @example
 * The Shadow DOM ensures encapsulation:
 * ```tsx
 * const shadow = host!.attachShadow({ mode: "open" });
 * createRoot(shadow).render(<App />);
 * ```
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ContentMenu, QuickMessagesMenu } from "./components";

import indexcss from "./index_content.css?inline";

const root = document.createElement("div");
root.id = "sct-root";
document.body.appendChild(root);
const host = document.querySelector("#sct-root");
const shadow = host!.attachShadow({ mode: "open" });
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
