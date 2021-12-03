import type { Generator } from '../dist';
import { Contexted } from '../dist';

type Context = {
	readonly request: string;
	response?: string[];
};

class Driver {
	private subscribers: {
		[test: string]: (request: string) => Promise<string[]>;
	};

	constructor() {
		this.subscribers = {};
	}

	subscribe(test: string, handler: (request: string) => Promise<string[]>) {
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

const driver = new Driver();

const contextGenerator: Generator<string, Context> = (request) => ({
	request,
});

const responseGenerator: Generator<Context, string[]> = (context) => [
	...(context.response || []),
	'done',
];

const application = new Contexted<
	string,
	Context,
	{ [key: string]: string },
	string,
	string[]
>({
	subscriber: (test, handler) => driver.subscribe(test, handler as any),
	contextGenerator,
	responseGenerator,
});

application.registerRoute({
	test: 'replace',
	middlewares: [
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
					'{{ name }}': 'contexted',
				},
			],
		},
	],
});

application.registerRoute({
	test: 'chain',
	middlewares: [
		{
			middleware: (context) => {
				context.response = [context.request, 'one'];
				return context;
			},
		},
		{
			middleware: (context) => {
				context.response.push('two');
				return context;
			},
		},
	],
});

test('Subscribe and unsubscribing Reverse route with "teststring" as input data.', async () => {
	const unsubscribe = await application.registerRoute({
		test: 'reverse',
		middlewares: [
			{
				middleware: (context) => {
					context.response = [
						context.request.split('').reverse().join(''),
					];
					return context;
				},
			},
		],
	});

	expect(await driver.emit('reverse', 'teststring')).toStrictEqual([
		'gnirtstset',
		'done',
	]);

	await unsubscribe();
	expect(await driver.emit('reverse', 'teststring')).toBeNull();
});

test('Replace route with "testing {{ name }}" as input data.', async () =>
	expect(await driver.emit('replace', 'testing {{ name }}')).toStrictEqual([
		'testing contexted',
		'done',
	]));

test('Chain route with "zero" as input data.', async () =>
	expect(await driver.emit('chain', 'zero')).toStrictEqual([
		'zero',
		'one',
		'two',
		'done',
	]));
