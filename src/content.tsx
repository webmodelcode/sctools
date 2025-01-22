import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ContentMenu } from "./components";

import indexcss from "./index_content.css?inline";

const root = document.createElement("div");
root.id = "sct-root";
document.body.appendChild(root);
const host = document.querySelector("#sct-root");
const shadow = host!.attachShadow({ mode: "open" });
const style = document.createElement("style");
const body = indexcss;
console.log(indexcss);
style.textContent = body;
shadow.appendChild(style);

createRoot(shadow).render(
  <StrictMode>
    <div id="sct-shadow-dom">
      <ContentMenu />
    </div>
  </StrictMode>
);
