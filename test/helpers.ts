import type { Context, Generator } from '../src';

export type TestContext = Context & {
	readonly request: string;
	response?: string[];
};

export const contextGenerator: Generator<string, TestContext> = (request) => ({
	request,
	response: [],
	next: true,
});

export const responseGeneratorFlag = 'response-generator-flag';
export const responseGenerator: Generator<TestContext, string[]> = ({ response }) => [
	...(response || []),
	responseGeneratorFlag,
];
