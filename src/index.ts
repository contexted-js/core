export type Middleware<ContextType, InjectablesType> = (
	context: ContextType,
	...injectables: InjectablesType[]
) => any | Promise<any>;

export type Stream<ContextType, InjectablesType> = (
	| Middleware<ContextType, never>
	| {
			middleware: Middleware<ContextType, InjectablesType>;
			injectables: InjectablesType[];
	  }
)[];

export type Route<ContextType, TestType, InjectablesType> = {
	test: TestType[];
	middlewares: Stream<ContextType, InjectablesType>;
};

export interface Driver<ContextType, TestType, InjectablesType> {
	subscribe(route: Route<ContextType, TestType, InjectablesType>): Function;
}

export class Contexted<ContextType, TestType, InjectablesType> {
	private registeredRoutes: {
		route: Route<ContextType, TestType, InjectablesType>;
		unsubscriber: Function;
	}[];

	constructor(
		private driver: Driver<ContextType, TestType, InjectablesType>,
		routes: Route<ContextType, TestType, InjectablesType>[] = []
	) {
		this.registeredRoutes = [];
		for (const route of routes) this.registerRoute(route);
	}

	public registerRoute(route: Route<ContextType, TestType, InjectablesType>) {
		const unsubscriber = this.driver.subscribe(route);
		if (unsubscriber)
			this.registeredRoutes.push({
				route,
				unsubscriber,
			});
	}

	public unregisterRoute(route: Route<ContextType, TestType, InjectablesType>) {
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
