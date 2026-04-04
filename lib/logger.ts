const isDev = process.env.NODE_ENV === "development";

export const logger = {
  info: (...args: unknown[]) => {
    if (isDev) {
      // eslint-disable-next-line no-console
      console.info("[INFO]", ...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (isDev) {
      // eslint-disable-next-line no-console
      console.warn("[WARN]", ...args);
    }
  },
  error: (...args: unknown[]) => {
    // errors always log
    // eslint-disable-next-line no-console
    console.error("[ERROR]", ...args);
  },
};
