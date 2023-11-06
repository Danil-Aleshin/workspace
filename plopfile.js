/* eslint-disable @typescript-eslint/no-var-requires */
const moduleGenerate = require("./configs/plop/module.js");

module.exports = function (
	/** @type {import('plop').NodePlopAPI} */
	plop
) {
	moduleGenerate(plop);
};
