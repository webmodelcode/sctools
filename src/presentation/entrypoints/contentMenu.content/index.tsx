// 1. Import the style
import ReactDOM from "react-dom/client";
import { ContentMenu } from "~@/presentation/components/ContentMenu/ContentMenu";

import "~@/presentation/assets/globals.css";

export default defineContentScript({
  matches: [
    "https://*.stripchat.com/*",
    "https://*.chaturbate.com/*",
    "https://performerclient.streamatemodels.com/*",
  ],
  // 2. Set cssInjectionMode
  cssInjectionMode: "ui",

  async main(ctx) {
    // 3. Define your UI
    const ui = await createShadowRootUi(ctx, {
      name: "content-menu",
      position: "inline",
      anchor: "body",
      onMount: (container) => {
        // Container is a body, and React warns when creating a root on the body, so create a wrapper div
        const app = document.createElement("div");
        container.append(app);

        // Create a root on the UI container and render a component
        const root = ReactDOM.createRoot(app);
        root.render(<ContentMenu />);
        return root;
      },
      onRemove: (root) => {
        // Unmount the root when the UI is removed
        root?.unmount();
      },
    });

    // 4. Mount the UI
    ui.mount();
  },
});
