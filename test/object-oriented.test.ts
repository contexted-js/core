import type { SubscriberHandler } from '../src';
import { Contexted } from '../src';

import {
	contextGenerator,
	responseGenerator,
	responseGeneratorFlag,
} from './helpers';

class Driver {
	private subscribers: {
		[test: string]: SubscriberHandler<string, string[]>;
	};

	constructor() {
		this.subscribers = {};
	}

	subscribe(test: string, handler: SubscriberHandler<string, string[]>) {
		if (this.subscribers[test]) return;

		this.subscribers[test] = handler;

		return () => {
			if (!this.subscribers[test]) return false;

			delete this.subscribers[test];

			return true;
		};
	}

	async emit(route: string, data: string) {
		for (const [test, handler] of Object.entries(this.subscribers))
			if (route === test) return await handler(data);

		return null;
	}
}

describe('with mutable context', () => {
	const driver = new Driver();
	const application = new Contexted({
		subscriber: (test: string, handler) => driver.subscribe(test, handler),
		contextGenerator,
		responseGenerator,
	});

	test('subscribing and Unsubscribing', async () => {
		const testFlag = 'print-flag';

		const unsubscribe = await application.subscribeRoute({
			test: 'print',
			controllers: [
				{
					middleware: ({ request, response }) =>
						response.push(request),
				},
			],
		});

		expect(await driver.emit('print', testFlag)).toStrictEqual([
			testFlag,
			responseGeneratorFlag,
		]);

		await unsubscribe();
		expect(await driver.emit('print', testFlag)).toBeNull();
	});

	test('Request with data', async () => {
		const testFlag = 'replace-{{ data }}';

		await application.subscribeRoute({
			test: 'replace',
			controllers: [
				{
					middleware: (
						context,
						...map: { [key: string]: string }[]
					) => {
						let response = context.request;

						for (const rules of map)
							for (const [key, value] of Object.entries(rules))
								response = response.replace(key, value);

						context.response = [response];
					},
					injectables: [
						{
							'{{ data }}': 'flag',
						},
					],
				},
			],
		});

		expect(await driver.emit('replace', testFlag)).toStrictEqual([
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

		await application.subscribeRoute({
			test: 'chain',
			controllers: [
				{
					middleware: ({ request, response }) =>
						response.push(request, testFlags[1]),
				},
				{
					middleware: (context) => {
						context.response.push(testFlags[2]);
						context.next = false;
					},
				},
				{
					middleware: ({ response }) => response.push(testFlags[3]),
				},
			],
		});

		expect(await driver.emit('chain', testFlags[0])).toStrictEqual([
			testFlags[0],
			testFlags[1],
			testFlags[2],
			responseGeneratorFlag,
		]);
	});
});

describe('with immutable context', () => {
	const driver = new Driver();
	const application = new Contexted({
		subscriber: (test: string, handler) => driver.subscribe(test, handler),
		contextGenerator,
		responseGenerator,
		immutableContext: true,
	});

	test('subscribing and Unsubscribing', async () => {
		const testFlag = 'print-flag';

		const unsubscribe = await application.subscribeRoute({
			test: 'print',
			controllers: [
				{
					middleware: (context) => {
						context.response.push(context.request);
						return context;
					},
				},
			],
		});

		expect(await driver.emit('print', testFlag)).toStrictEqual([
			testFlag,
			responseGeneratorFlag,
		]);

		await unsubscribe();
		expect(await driver.emit('print', testFlag)).toBeNull();
	});

	test('Request with data', async () => {
		const testFlag = 'replace-{{ data }}';

		await application.subscribeRoute({
			test: 'replace',
			controllers: [
				{
					middleware: (
						context,
						...map: { [key: string]: string }[]
					) => {
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
		});

		expect(await driver.emit('replace', testFlag)).toStrictEqual([
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

		await application.subscribeRoute({
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
		});

		expect(await driver.emit('chain', testFlags[0])).toStrictEqual([
			testFlags[0],
			testFlags[1],
			testFlags[2],
			responseGeneratorFlag,
		]);
	});
});
