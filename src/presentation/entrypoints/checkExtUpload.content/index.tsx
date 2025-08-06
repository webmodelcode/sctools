// 1. Import the style
import ReactDOM from "react-dom/client";

import { CheckExtUpload } from "~@/presentation/components/CheckExtUpload/CheckExtUpload";

import "~@/presentation/assets/globals.css";

export default defineContentScript({
  matches: ["<all_urls>"],
  // 2. Set cssInjectionMode
  cssInjectionMode: "ui",

  async main(ctx) {
    // 3. Define your UI
    const ui = await createShadowRootUi(ctx, {
      name: "check-ext-upload",
      position: "inline",
      anchor: "body",
      onMount: (container) => {
        // Container is a body, and React warns when creating a root on the body, so create a wrapper div
        const app = document.createElement("div");
        container.append(app);

        // Create a root on the UI container and render a component
        const root = ReactDOM.createRoot(app);
        root.render(
          <>
            <CheckExtUpload />
          </>,
        );
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
