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
  error: (customMsg: string, error?: Error | unknown) => {
    if (isDevEnvironment()) {
      console.log(
        `%c[❌] ${customMsg} ${error instanceof Error ? (error.message ?? error) : error}`,
        "color: red",
      );
    }
  },
};
