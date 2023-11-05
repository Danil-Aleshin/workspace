import { IModule } from "../Module/Module";
import { NCore } from "../Types/types";

/** класс который служит для хранения всех модулей */
export class IntermediaryModules {
	public static instance: IntermediaryModules;
	private modules: IModule[] = [];
	private routes: NCore.IRoute[] = [];
	private errors: NCore.TError[] = [];

	/** возвращает хранилище модулей или если его нет, создает */
	public static getInstance(): IntermediaryModules {
		if (IntermediaryModules.instance) {
			return IntermediaryModules.instance;
		}

		IntermediaryModules.instance = new IntermediaryModules();

		return IntermediaryModules.instance;
	}

	public getRoutes(): NCore.IRoute[] {
		return this.routes;
	}

	public getErrors(): NCore.TError[] {
		return this.errors;
	}

	public getModules(): IModule[] {
		return this.modules;
	}

	public expandModules(module: IModule) {
		this.modules.push(module);
		return this;
	}

	public expandRoutes(routesConfig: NCore.IRoute[] | undefined) {
		if (routesConfig) {
			this.routes = [...this.routes, ...routesConfig];
		}

		return this;
	}

	public expandErrors(errorsConfig: NCore.TError[] | undefined) {
		if (errorsConfig) {
			this.errors = [...this.errors, ...errorsConfig];
		}
		return this;
	}

	public expandExtenders(extendersConfig: NCore.TExtendersConfig | undefined) {
		if (!extendersConfig) {
			return this;
		}

		for (const key in extendersConfig) {
			if (Object.prototype.hasOwnProperty.call(extendersConfig, key)) {
				const extenderFunc = extendersConfig[key];

				if (extenderFunc && typeof extendersConfig === "function") {
					extenderFunc();
				}
			}
		}
	}

	public expandMountEffect(mountEffect: (() => void) | null) {
		if (typeof mountEffect === "function") {
			mountEffect();
		}

		return this;
	}

	public build() {
		this.modules.forEach((module) => {
			this.expandRoutes(module.getRoutes()?.());
			this.expandErrors(module.getErrorsConfig()?.());
			this.expandExtenders(module.getExtendersConfig()?.());
			this.expandMountEffect(module.getMountEffect());
		});
	}
}
