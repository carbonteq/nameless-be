// https:/ / jestjs.io / docs / configuration;

/** @type {require('@jest/types').Config.InitialOptions} */
const config = {
	moduleFileExtensions: ["js", "json", "ts"],
	rootDir: "src",
	testRegex: ".*\\.spec\\.ts$",
	transform: {
		"^.+\\.(t|j)s$": "@swc/jest", // TODO: replace with @swc/jest
	},
	collectCoverageFrom: ["**/*.(t|j)s"],
	coverageDirectory: "../coverage",
	testEnvironment: "node",
	moduleNameMapper: {
		"^src(.*)$": "<rootDir>/$1",
		"^@app(.*)$": "<rootDir>/app$1",
		"^@common(.*)$": "<rootDir>/common$1",
		"^@web(.*)$": "<rootDir>/web$1",
		"^@domain(.*)$": "<rootDir>/domain$1",
		"^@infra(.*)$": "<rootDir>/infra$1",
		"^@shared(.*)$": "<rootDir>/shared$1",
	},
};

module.exports = config;
