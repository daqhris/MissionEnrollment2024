/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  testEnvironment: "jest-environment-jsdom",
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.jest.json",
        useESM: true,
        babelConfig: {
          presets: [
            "@babel/preset-env",
            ["@babel/preset-react", { "runtime": "automatic" }],
            "@babel/preset-typescript"
          ],
          plugins: ["@babel/plugin-transform-runtime"],
        },
      },
    ],
    "^.+\\.(js|jsx)$": [
      "babel-jest",
      {
        presets: [
          "@babel/preset-env",
          ["@babel/preset-react", { "runtime": "automatic" }]
        ],
        plugins: ["@babel/plugin-transform-runtime"],
      },
    ],
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  preset: "ts-jest",
  transformIgnorePatterns: ["/node_modules/(?!(wagmi|@wagmi|@tanstack|viem|@viem))"],
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json", "node"],
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
  testPathIgnorePatterns: ["/node_modules/", "/.next/"],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.jest.json',
      jsx: 'react-jsx',
    },
  },
  testEnvironment: 'jsdom',
};
