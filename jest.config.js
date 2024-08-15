/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  testEnvironment: "jest-environment-jsdom",
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.jest.json",
        useESM: true,
      },
    ],
    "^.+\\.(js|jsx)$": [
      "babel-jest",
      {
        presets: ["@babel/preset-env", "@babel/preset-react"],
      },
    ],
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  preset: "ts-jest",
  transformIgnorePatterns: ["/node_modules/(?!(wagmi|@wagmi|@tanstack|viem|@viem))"],
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  setupFilesAfterEnv: [require.resolve("@testing-library/jest-dom/extend-expect"), "<rootDir>/jest.setup.js"],
  moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json", "node"],
};
