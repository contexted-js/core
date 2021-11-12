import type { Driver, Stream, Route } from '../dist';
import { Contexted } from '../dist';

type Context = {
	readonly request: string;
	response?: string;
};

class TestDriver implements Driver<Context, string, string> {
	private routes: { [key: string]: Stream<Context, string> };

	constructor() {
		this.routes = {};
	}

	subscribe(route: Route<Context, string, string>) {
		const key = route.test.join(':');
		if (this.routes[key]) return;

		this.routes[key] = route.middlewares;
		return () => delete this.routes[key];
	}

	async trigger(test: string) {
		for (const [key, middlewares] of Object.entries(this.routes))
			if (key === test) {
				const context: Context = { request: test, response: 'date' };
				for (const middleware of middlewares) {
					const [operator, injectables] =
						typeof middleware == 'function'
							? [middleware, []]
							: [middleware.middleware, middleware.injectables];

					await operator(context, ...injectables);
				}
				return context;
				break;
			}
	}
}

async function test() {
	try {
		const driver = new TestDriver();
		const app = new Contexted(driver, [
			{
				test: ['echo'],
				middlewares: [(context) => (context.response = 'echo')],
			},
		]);

		const dateRoute: Route<Context, string, string> = {
			test: ['date'],
			middlewares: [
				(context) => (context.response = new Date().toString()),
			],
		};

		const externalKey = Math.random().toString();
		const externalRoute: Route<Context, string, string> = {
			test: ['external', 'key'],
			middlewares: [
				{
					middleware: (context, key) => (context.response = key),
					injectables: [externalKey],
				},
			],
		};

		console.log(await driver.trigger('echo'));
		console.log(await driver.trigger('date'));

		app.registerRoute(dateRoute);
		console.log(await driver.trigger('date'));

		app.unregisterRoute(dateRoute);
		console.log(await driver.trigger('date'));

		console.log(externalKey);
		app.registerRoute(externalRoute);
		console.log(await driver.trigger('external:key'));
	} catch (error) {
		console.error(new Date(), error);
	}
}

test();
