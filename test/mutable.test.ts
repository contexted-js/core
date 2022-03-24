import type { Subscriber, Transformer, Traverser, Unsubscriber } from '../src';

import { Contexted } from '../src';

type Test = string;

type Request = string;
type Response = string;

type Context = {
	readonly request: Request;
	response: Response;
};

type Injectables = () => Date;
type Immutable = false;

const routes: { [test: Test]: Transformer<Request, Response> } = {};

const timeService: Injectables = () => new Date();

const emit = async (test: Test, request?: Request) => {
	if (!routes[test]) return;
	return await routes[test](request);
};

const subscriber: Subscriber<Test, Request, Response> = async (
	test,
	callback
) => {
	if (routes[test]) return;

	routes[test] = callback;
	return () => {
		delete routes[test];
	};
};

const traverser: Traverser<Context, Injectables, Immutable> = async (
	context,
	...controllers
) => {
	for (const controller of controllers)
		await controller.middleware(context, ...(controller.injectables || []));

	return context;
};

const requestTransformer: Transformer<Request, Context> = (request) => ({
	request,
	response: null,
});
const responseTransformer: Transformer<Context, Response> = (context) =>
	context.response;

const application = new Contexted<
	Test,
	Context,
	Injectables,
	Request,
	Response,
	Immutable
>({
	subscriber,
	traverser,
	requestTransformer,
	responseTransformer,
});

describe('Subscribtion', () => {
	let unsubscribe: Unsubscriber = null;

	test('Validate subscribtion', async () => {
		unsubscribe = await application.subscribeRoute({
			test: 'reverse',
			controllers: [
				{
					middleware: (context) => {
						context.response = context.request
							.split('')
							.reverse()
							.join('');
					},
				},
			],
		});

		expect(await emit('reverse', 'ABCDEFG')).toEqual('GFEDCBA');
	});

	test('Validate unsubscribtion', async () => {
		await unsubscribe();
		expect(await emit('reverse', 'ABCDEFG')).toBeUndefined();
	});
});

describe('Injection', () => {
	test('Use injectables with middleware', async () => {
		await application.subscribeRoute({
			test: 'time',
			controllers: [
				{
					middleware: (context, timeService) => {
						context.response = timeService()
							.getFullYear()
							.toString();
					},
					injectables: [timeService],
				},
			],
		});

		expect(await emit('time')).toEqual(new Date().getFullYear().toString());
	});
});
