import type { SubscriberHandler } from '../src';
import { subscribeRoute } from '../src';

import {
	TestContext,
	contextGenerator,
	responseGenerator,
	responseGeneratorFlag,
} from './helpers';

const subscribers: {
	[test: string]: SubscriberHandler<string, string[]>;
} = {};

const subscriber = (
	test: string,
	handler: SubscriberHandler<string, string[]>
) => {
	if (subscribers[test]) return;

	subscribers[test] = handler;

	return () => {
		if (!subscribers[test]) return false;

		delete subscribers[test];

		return true;
	};
};

const emit = async (route: string, data: string) => {
	for (const [test, handler] of Object.entries(subscribers))
		if (route === test) return await handler(data);

	return null;
};

test('Subscribing and Unsubscribing', async () => {
	const testFlag = 'print-flag';

	const unsubscribe = await subscribeRoute(
		subscriber,
		{
			test: 'print',
			controllers: [
				{
					middleware: (context) => {
						context.response.push(context.request);
						return context;
					},
				},
			],
		},
		contextGenerator,
		responseGenerator
	);

	expect(await emit('print', testFlag)).toStrictEqual([
		testFlag,
		responseGeneratorFlag,
	]);

	await unsubscribe();
	expect(await emit('print', testFlag)).toBeNull();
});

test('Request with data', async () => {
	const testFlag = 'replace-{{ data }}';

	await subscribeRoute(
		subscriber,
		{
			test: 'replace',
			controllers: [
				{
					middleware: (context, ...map) => {
						let response = context.request;

						for (const rules of map)
							for (const [key, value] of Object.entries(rules))
								response = response.replace(key, value);

						context.response = [response];

						return context;
					},
					injectables: [
						{
							'{{ data }}': 'flag',
						},
					],
				},
			],
		},
		contextGenerator,
		responseGenerator
	);

	expect(await emit('replace', testFlag)).toStrictEqual([
		testFlag.replace('{{ data }}', 'flag'),
		responseGeneratorFlag,
	]);
});

test('Next flag', async () => {
	const testFlags = [
		'chain-request-flag',
		'first-middleware-flag',
		'second-middleware-flag',
		'third-middleware-flag',
	];

	await subscribeRoute(
		subscriber,
		{
			test: 'chain',
			controllers: [
				{
					middleware: ({ request }) => ({
						request,
						response: [request, testFlags[1]],
						next: true,
					}),
				},
				{
					middleware: ({ request, response }) => ({
						request,
						response: [...response, testFlags[2]],
						next: false,
					}),
				},
				{
					middleware: ({ request, response }) => ({
						request,
						response: [...response, testFlags[3]],
						next: true,
					}),
				},
			],
		},
		contextGenerator,
		responseGenerator
	);

	expect(await emit('chain', testFlags[0])).toStrictEqual([
		testFlags[0],
		testFlags[1],
		testFlags[2],
		responseGeneratorFlag,
	]);
});
