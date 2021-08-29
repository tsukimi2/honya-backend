module.exports = {
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
  // https://github.com/mswjs/msw/issues/170
  //setupFiles: ['./jest.setup.js'],
  // https://stackoverflow.com/questions/48033841/test-process-env-with-jest
  setupFiles: ["<rootDir>/.jest/setEnvVars.js"],
  setupFilesAfterEnv: ["<rootDir>/setupTests.js"],
  transform: {
    // "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest"
    // Use babel-jest to transpile tests with the next/babel preset
    // https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  "moduleNameMapper": {
    // https://jestjs.io/docs/25.x/webpack
    // "\\.(css|less)$": "identity-obj-proxy"
    // Handle CSS imports (with CSS modules)
    // https://jestjs.io/docs/webpack#mocking-css-modules
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',

    // Handle CSS imports (without CSS modules)
    '^.+\\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',

    // Handle image imports
    // https://jestjs.io/docs/webpack#handling-static-assets
    '^.+\\.(jpg|jpeg|png|gif|webp|svg)$': `<rootDir>/__mocks__/fileMock.js`,
  },
  // https://jestjs.io/docs/configuration#testenvironment-string
  testEnvironment: "jsdom",
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
};