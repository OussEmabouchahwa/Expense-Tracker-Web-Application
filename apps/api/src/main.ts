import { createApp, finalizeApp } from "./app.js";
import { getEnv } from "./config/env.js";
import { logger } from "./lib/logger.js";

const env = getEnv();
const app = createApp();

finalizeApp(app);

const server = app.listen(env.PORT, () => {
  logger.info({ port: env.PORT, env: env.NODE_ENV }, "Masrouf API listening");
});

function gracefulShutdown(signal: string): void {
  logger.info({ signal }, "Gracefully shutting down");
  server.close(() => {
    logger.info("Closed HTTP server");
    process.exit(0);
  });

  setTimeout(() => {
    logger.error("Forceful shutdown after timeout");
    process.exit(1);
  }, 10000).unref();
}

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
