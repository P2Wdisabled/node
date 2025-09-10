module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  testMatch: ["**/tests/**/*.test.js"],
  testPathIgnorePatterns: ["/node_modules/", "/e2e/"],
  collectCoverageFrom: [
    "**/*.js",
    "!**/node_modules/**",
    "!**/generated/**",
    "!jest.config.js",
    "!**/coverage/**",
    "!e2e/**",
  ],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
  testTimeout: 10000, // For Socket.IO tests
  transformIgnorePatterns: ["node_modules/(?!(.*\\.mjs$))"],
};
