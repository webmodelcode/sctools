// Mock para WXT imports en Storybook
// Este archivo resuelve las dependencias de '#imports' que no están disponibles en Storybook

// Mock del storage de WXT
export const storage = {
  defineItem: (key, options = {}) => ({
    key,
    defaultValue: options.defaultValue || null,
    getValue: async () => options.defaultValue || null,
    setValue: async (value) => {
      console.log(`Mock storage setValue: ${key} = ${value}`);
      return value;
    },
    removeValue: async () => {
      console.log(`Mock storage removeValue: ${key}`);
    },
    watch: (callback) => {
      console.log(`Mock storage watch: ${key}`);
      return () => {}; // unwatch function
    }
  })
};

// Mock de otras funciones de WXT que puedan ser necesarias
export const browser = {
  runtime: {
    getURL: (path) => `chrome-extension://mock-id/${path}`,
    sendMessage: async (message) => {
      console.log('Mock browser.runtime.sendMessage:', message);
      return { success: true };
    }
  },
  tabs: {
    query: async (queryInfo) => {
      console.log('Mock browser.tabs.query:', queryInfo);
      return [];
    }
  }
};

// Exportación por defecto
export default {
  storage,
  browser
};