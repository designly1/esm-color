/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	moduleFileExtensions: ['ts', 'js'],
	testMatch: ['**/tests/**/*.test.ts'], // Adjust the path if necessary
	transform: {
		'^.+\\.ts$': 'ts-jest',
	},
	collectCoverage: true,
	collectCoverageFrom: [
		'src/**/*.{ts,js}', // Include all .ts and .js files in the src directory
		'!src/helpers.ts', // Exclude helpers.ts
		'!src/**/*.d.ts', // Exclude type declaration files
	],
	coverageDirectory: './coverage',
};
