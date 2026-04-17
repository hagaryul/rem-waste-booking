import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    retries: {
      runMode: 2,
      openMode: 1,
    },
    screenshotOnRunFailure: true,
    video: true,
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 8000,
    setupNodeEvents(on, config) {
      on("task", {
        log(message: string) {
          console.log(`[REM Waste Test] ${message}`);
          return null;
        },
      });
      return config;
    },
  },
});
