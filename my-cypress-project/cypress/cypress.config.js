const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on("task", {
        fsCopyFile({ path, newPath, mode }) {
          return cy.task("fsCopyFile", { path, newPath, mode });
        }
      });
    },
  },
});

