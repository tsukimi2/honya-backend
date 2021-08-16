module.exports = {
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
  setupFilesAfterEnv: ["<rootDir>/setupTests.js"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest"
  },
  "moduleNameMapper": {
    // https://jestjs.io/docs/25.x/webpack
    "\\.(css|less)$": "identity-obj-proxy"
  },
  // https://jestjs.io/docs/configuration#testenvironment-string
  testEnvironment: "jsdom"
};