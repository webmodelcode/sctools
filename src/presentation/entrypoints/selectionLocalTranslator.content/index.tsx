import ReactDOM from "react-dom/client";
import { SelectionLocalTranslator } from "~@/presentation/components/SelectionLocalTranslator/SelectionLocalTranslator";
import "~@/presentation/assets/globals.css";

export default defineContentScript({
  matches: ["*://*/*"],
  cssInjectionMode: "ui",

  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: "selection-local-translator",
      position: "inline",
      anchor: "body",
      onMount: (container) => {
        const app = document.createElement("div");
        container.append(app);
        const root = ReactDOM.createRoot(app);
        root.render(<SelectionLocalTranslator />);
        return root;
      },
      onRemove: (root) => {
        root?.unmount();
      },
    });
    ui.mount();
  },
});
