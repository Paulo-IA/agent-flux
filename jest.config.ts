export default {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "js"],
  transform: {
    "^.+\\.ts$": "ts-jest", // Transforma arquivos .ts
  },
  testMatch: ["**/?(*.)+(spec|test).ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1", // Remove .js dos imports
  },
};