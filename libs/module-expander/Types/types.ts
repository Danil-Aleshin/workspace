import { NonIndexRouteObject } from "react-router-dom";

export declare namespace NCore {
	interface IRoute extends NonIndexRouteObject {
		key?: string;
		path: string;
		originalPath?: string;
		exact?: boolean;
		redirect?: string;
		priority?: number;
		routes?: IRoute[];
		backUrl?: string;
		icon: React.FC<React.SVGAttributes<SVGElement>>;
		component?: React.FC;
	}

	type TError = {
		code?: string;
		error?: any;
		params?: any;
		message?: string;
		comment?: string;
		title?: string;
		reloadOnClose?: boolean;
		traceId?: string;
	};

	type TExtendersConfig = { [key: string]: () => void };

	type TExtendersConfigFunc = () => TExtendersConfig;
	type TRoutesFunc = () => IRoute[];
	type TErrorsFunc = () => TError[];
}
