import { IntermediaryModules } from "./IntermediaryModules/IntermediaryModules";
import { IntermediaryExtensions } from "./IntermediaryExtensions/IntermediaryExtensions";
import { Module, IModule } from "./Module/Module";
import { registerModule } from "./registerModule/registerModule";
import { NCore } from "./Types/types";

class ModuleBuilder {
	public static build() {
		IntermediaryModules.getInstance().build();
	}
}

export { ModuleBuilder, IntermediaryModules, IntermediaryExtensions, Module, registerModule };

export type { IModule, NCore };
