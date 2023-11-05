import { NCore } from "../Types/types";

type TFunction = (() => void) | null;

export interface IModule {
	getRoutes(): NCore.TRoutesFunc | null;
	getErrorsConfig(): NCore.TErrorsFunc | null;
	getExtendersConfig(): NCore.TExtendersConfigFunc | null;
	getMountEffect(): TFunction;
}

export type TModuleParams = {
	name: string;
	routesConfig?: NCore.TRoutesFunc;
	mountEffect?: TFunction;
	errorsConfig?: NCore.TErrorsFunc;
	extendersConfig?: NCore.TExtendersConfigFunc;
};

/** класс подключаемого модуля */
export class Module implements IModule {
	public name: string;

	protected routesConfig: NCore.TRoutesFunc | null;
	protected errorsConfig: NCore.TErrorsFunc | null;
	protected extendersConfig: NCore.TExtendersConfigFunc | null;
	protected mountEffect: TFunction;

	constructor({ name, errorsConfig, extendersConfig, mountEffect, routesConfig }: TModuleParams) {
		this.name = name;
		this.routesConfig = routesConfig || null;
		this.errorsConfig = errorsConfig || null;
		this.extendersConfig = extendersConfig || null;
		this.mountEffect = mountEffect || null;
	}

	getErrorsConfig(): NCore.TErrorsFunc | null {
		return this.errorsConfig;
	}

	getExtendersConfig(): NCore.TExtendersConfigFunc | null {
		return this.extendersConfig;
	}

	getMountEffect(): TFunction {
		return this.mountEffect;
	}

	getRoutes(): NCore.TRoutesFunc | null {
		return this.routesConfig;
	}
}
