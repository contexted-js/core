export type Middleware<ContextType> = (
	context: ContextType
) => any | Promise<any>;

export type Route<ContextType, TestType> = {
	test: TestType[];
	middlewares: Middleware<ContextType>[];
};

export interface Driver<ContextType, TestType> {
	subscribe(route: Route<ContextType, TestType>): Function;
}

export class Contexted<ContextType, TestType> {
	private registeredRoutes: {
		route: Route<ContextType, TestType>;
		unsubscriber: Function;
	}[];

	constructor(
		private driver: Driver<ContextType, TestType>,
		routes: Route<ContextType, TestType>[] = []
	) {
		this.registeredRoutes = [];
		for (const route of routes) this.registerRoute(route);
	}

	public registerRoute(route: Route<ContextType, TestType>) {
		const unsubscriber = this.driver.subscribe(route);
		if (unsubscriber)
			this.registeredRoutes.push({
				route,
				unsubscriber,
			});
	}

	public unregisterRoute(route: Route<ContextType, TestType>) {
		for (const registeredRoute of this.registeredRoutes)
			if (registeredRoute.route === route) {
				registeredRoute.unsubscriber();
				this.registeredRoutes = this.registeredRoutes.splice(
					this.registeredRoutes.indexOf(registeredRoute),
					1
				);
			}
	}

	public getRegisteredRoutes() {
		return this.registeredRoutes;
	}
}
