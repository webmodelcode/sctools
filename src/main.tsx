import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Popup } from "./components";
import "./index.css";
import { QuickMessagesMenu } from "./components/QuickMessages/QuickMessagesMenu/QuickMessagesMenu";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Popup />
    <QuickMessagesMenu />
    <input type="text" />
  </StrictMode>
);
