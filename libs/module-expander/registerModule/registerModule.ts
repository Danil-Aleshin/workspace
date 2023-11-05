import { IntermediaryModules } from "../IntermediaryModules/IntermediaryModules";
import { IModule, TModuleParams } from "../Module/Module";

interface IModuleClass {
	new (params: TModuleParams): IModule;
}

/** функция регистрации модуля в IntermediaryModules */
export const registerModule =
	(params: TModuleParams) =>
	<T extends IModuleClass>(Module: T) => {
		const ModuleInstance = new Module(params);

		IntermediaryModules.getInstance().expandModules(ModuleInstance);
	};
