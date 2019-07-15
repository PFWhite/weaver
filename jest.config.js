module.exports = {
    // verbose: false,
    collectCoverage: true,
    setupFilesAfterEnv: ["jest-extended"],
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/weaver/tests/',
    ]
}
