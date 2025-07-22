import { defineConfig, type WxtViteConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    permissions: ["activeTab", "tabs", "storage", "scripting"],
    name: "EW Model Tools",
    description:
      "Incorporamos herramientas para mejorar la experiencia de trabajo de los modelos de EW.",
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
