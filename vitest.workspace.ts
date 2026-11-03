import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  {
    test: {
      name: "contracts",
      root: "./packages/contracts",
      environment: "node",
      include: ["src/**/*.test.ts"],
    },
  },
  {
    test: {
      name: "api",
      root: "./apps/api",
      environment: "node",
      include: ["src/**/*.test.ts"],
    },
  },
  {
    test: {
      name: "web",
      root: "./apps/web",
      environment: "jsdom",
      globals: true,
      setupFiles: ["./src/test/setup.ts"],
      include: ["src/**/*.test.{ts,tsx}"],
    },
  },
]);
