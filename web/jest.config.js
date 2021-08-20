module.exports = {
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
  // https://github.com/mswjs/msw/issues/170
  //setupFiles: ['./jest.setup.js'],
  // https://stackoverflow.com/questions/48033841/test-process-env-with-jest
  setupFiles: ["<rootDir>/.jest/setEnvVars.js"],
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