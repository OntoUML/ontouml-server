module.exports = {
  cache: false,
  testEnvironment: 'node',
  setupFilesAfterEnv: ["./setup.ts"],
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest",
    '^.+\\.(ts|tsx)?$': 'babel-jest'
  },
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node",
  ],
  moduleNameMapper: {
    "^@configs(.*)": "<rootDir>/src/configs$1",
    "^@error(.*)": "<rootDir>/src/error$1",
    "^@routes(.*)": "<rootDir>/src/routes$1",
    "^@utils(.*)": "<rootDir>/src/utils$1"
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(ts|js)x?$',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/**/*.d.ts',
  ]
};
