// 1. Import the style
import ReactDOM from "react-dom/client";

import { SmLocalTranslator } from "~@/presentation/components/SmLocalTranslator/SmLocalTranslator";

import "~@/presentation/assets/globals.css";
import { smAdapter } from "~@/config/smAdapter/sm.adapter";

export default defineContentScript({
  matches: ["https://performerclient.streamatemodels.com/*"],

  // 2. Set cssInjectionMode
  cssInjectionMode: "ui",

  async main(ctx) {
    // 3. Define your UI
    const ui = await createShadowRootUi(ctx, {
      name: "auto-translator",
      position: "inline",
      anchor: "body",
      onMount: (container) => {
        // Container is a body, and React warns when creating a root on the body, so create a wrapper div
        const app = document.createElement("div");
        container.append(app);

        // Create a root on the UI container and render a component
        const root = ReactDOM.createRoot(app);
        root.render(<SmLocalTranslator />);
        return root;
      },
      onRemove: (root) => {
        // Unmount the root when the UI is removed
        root?.unmount();
      },
    });

    // 4. Mount the UI
    const domCheckInterval = setInterval(() => {
      if (!!smAdapter.getChatTab()) {
        clearInterval(domCheckInterval);
        ui.mount();
      }
    }, 100);
    // ui.mount();
  },
});
