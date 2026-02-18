module.exports = {
  testEnvironment: "node",
  clearMocks: true,
  testMatch: ["**/tests/**/*.test.js"],
  globalSetup: "./tests/setup/globalSetup.js",
  globalTeardown: "./tests/setup/globalTeardown.js",
  // Prisma a veces se pone raro en paralelo:
  maxWorkers: 1
};