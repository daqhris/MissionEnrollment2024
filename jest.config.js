/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "jest-environment-jsdom",
  transform: {
    "^.+\\.(ts|tsx)$": "babel-jest",
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy"
  },
  preset: 'ts-jest/presets/js-with-babel',
  transformIgnorePatterns: [
    "/node_modules/(?!(wagmi|@wagmi|@tanstack|viem|@viem))"
  ],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  setupFilesAfterEnv: [
    require.resolve('@testing-library/jest-dom/extend-expect'),
    '<rootDir>/jest.setup.js'
  ],
};
