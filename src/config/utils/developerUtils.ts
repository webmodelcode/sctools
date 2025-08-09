const isDevEnvironment = () => import.meta.env.DEV;

export const devConsole = {
  log: (message: string) => {
    if (isDevEnvironment()) {
      console.log(`%c[ℹ️] ${message}`, "color: blue");
    }
  },
  warn: (message: string) => {
    if (isDevEnvironment()) {
      console.log(`%c[⚠️] ${message}`, "color: yellow");
    }
  },
  error: (error: Error) => {
    if (isDevEnvironment()) {
      console.log(`%c[❌] ${error.message ?? error}`, "color: red");
    }
  },
};
