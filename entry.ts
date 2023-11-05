import { ModuleBuilder } from "./libs/module-expander/index";
function importAll(ctx: __WebpackModuleApi.RequireContext) {
	ctx.keys().forEach(ctx);
}

importAll(require.context("./modules", true, /index.module\.[t]sx?$/));

(() => {
	ModuleBuilder.build();
})();
