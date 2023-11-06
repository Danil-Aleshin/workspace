/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");

const modulesPath = "modules/";

const prompts = [
	{
		message: "Введите название модуля: ",
		type: "input",
		name: "name",
	},
	{
		message: `Создайте репозиторий в Github и введите ссылку на репозиторий: `,
		type: "input",
		name: "repositoryURL",
		validate: (params) => Boolean(params.trim()),
	},
];

const getAddActionsBuilder = (modulePath, templatesPath) =>
	function getActions(filesStructure, parentPath = "", actions = []) {
		return filesStructure.reduce((acc, item) => {
			const { name, children, hasTemplate, ...rest } = item;

			const currentPath = `${parentPath}${name}`;

			let templateFilePath;

			if (hasTemplate) {
				const lastDotIndex = currentPath.lastIndexOf(".");

				if (lastDotIndex !== -1) {
					templateFilePath = `${templatesPath}${currentPath.slice(0, lastDotIndex)}.hbs`;
				}
			}

			return children
				? getActions(children, `${currentPath}/`, acc)
				: (acc.push({
					type: "add",
					path: `${modulePath}${currentPath}`,
					templateFile: templateFilePath,
					...rest,
				}),
					acc);
		}, actions);
	};

const getPackageTemplate = (packagesPath) => {
	const persistentModules = {
		dependencies: [
			"@emotion/react",
			"react",
			"react-router",
			"react-router-dom",
			"react-redux",
			"@reduxjs/toolkit",
			"axios",
			"react-query"
		],
		devDependencies: [
			"@types/react",
			"@types/react-dom",
			"@types/react-router-dom",
			"@types/react-router",
			"@types/react-query",
			"typescript",
			"prettier"
		],
	};

	const filterDependencies = (originalObj, dependenciesList) =>
		Object.fromEntries(dependenciesList.map((name) => [name, originalObj[name]]));

	const packageJson = JSON.parse(fs.readFileSync(`${packagesPath}platform/package.json`, "utf8"));

	packageJson.dependencies[packageJson.name] = packageJson.version;

	packageJson.name = "{{kebabCase name}}";
	packageJson.version = "1.0.0";
	packageJson.main = "src/index.module.ts";

	packageJson.repository = "https://github.com/Danil-Aleshin/{{kebabCase name}}"

	packageJson.dependencies = filterDependencies(
		packageJson.dependencies,
		persistentModules.dependencies
	);
	packageJson.devDependencies = filterDependencies(
		packageJson.devDependencies,
		persistentModules.devDependencies
	);

	return JSON.stringify(packageJson, null, "\t");
};

const actions = (data) => {
	const filesStructure = [
		{
			name: "src",
			children: [
				{
					name: "pages",
					children: [{ name: 'index.ts' }]
				},
				{
					name: "widgets",
					children: [
						{ name: 'index.ts' },
						{ name: 'components' },
					]
				},
				{
					name: "features",
					children: [{ name: 'index.ts' }]
				},
				{
					name: "entities",
					children: [{ name: 'index.ts' }]
				},
				{
					name: "shared",
					children: [
						{ name: 'assets' },
						{ name: 'components' },
						{ name: 'lib' },
						{
							name: 'configs',
							children: [{
								name: 'route.config.ts',
								hasTemplate: true
							}]
						},
						{ name: 'index.ts' },
					]
				},
				{
					name: "index.module.ts",
					hasTemplate: true,
				},
			],
		},
		{
			name: ".gitignore",
			templateFile: `${modulesPath}platform/.gitignore`,
		},
		{
			name: "package.json",
			template: getPackageTemplate(modulesPath),
		},
		{
			name: "tsconfig.json",
			hasTemplate: true,
		},
	];

	const modulePath = `${modulesPath}{{kebabCase name}}/`;
	const templatesPath = "configs/plop/templates/module/";

	const addActions = getAddActionsBuilder(modulePath, templatesPath)(filesStructure);

	const appendActions = [];

	const gitActions = [
		{
			type: "gitInit",
			modulePath: path.resolve(process.cwd(), modulesPath, data.name),
			rootPath: process.cwd(),
			verbose: true,
		},
	];

	return [...addActions, ...appendActions, ...gitActions];
};

module.exports = (
	/** @type {import('plop').NodePlopAPI} */
	plop
) => {
	plop.load(path.resolve(__dirname, "additions", "gitPack"));

	plop.setGenerator("Generate Module", {
		prompts,
		actions,
	});
};
