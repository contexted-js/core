import type { Driver, Middleware, Route } from '../dist';
import { Contexted } from '../dist';

type Context = {
	readonly request: string;
	response?: string;
};

class TestDriver implements Driver<Context, string> {
	private routes: { [key: string]: Middleware<Context>[] };

	constructor() {
		this.routes = {};
	}

	subscribe(route: Route<Context, string>) {
		const key = route.test.join(':');
		if (this.routes[key]) return;

		this.routes[key] = route.middlewares;
		return () => delete this.routes[key];
	}

	async trigger(test: string) {
		for (const [key, middlewares] of Object.entries(this.routes))
			if (key === test) {
				const context: Context = { request: test, response: 'date' };
				for (const middleware of middlewares) await middleware(context);
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

		const dateRoute: Route<Context, string> = {
			test: ['date'],
			middlewares: [
				(context) => (context.response = new Date().toString()),
			],
		};

		console.log(await driver.trigger('echo'));
		console.log(await driver.trigger('date'));

		app.registerRoute(dateRoute);
		console.log(await driver.trigger('date'));

		app.unregisterRoute(dateRoute);
		console.log(await driver.trigger('date'));
	} catch (error) {
		console.error(new Date(), error);
	}
}

test();
