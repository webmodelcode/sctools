import { defineConfig, type WxtViteConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    permissions: ["activeTab", "tabs", "storage", "scripting"],
    name: "EW Monitor Tools",
    description:
      "Extension para facilitar el trabajo de monitores en su día a día",
  },
  alias: {
    "~@": "src",
  },
  vite: () =>
    ({
      plugins: [tailwindcss()],
    } as WxtViteConfig),
  modules: ["@wxt-dev/module-react"],
  srcDir: "src/presentation",
});
