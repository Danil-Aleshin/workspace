/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require("webpack")
const path = require("path")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const TerserWebpackPlugin = require("terser-webpack-plugin")
//todo: webpack - настроить относительные пути к файлам
//todo: webpack - еще раз пройтись по настройки вебпака
//todo: webpack - разделить настройку вебпака на части
const isProd = process.env.NODE_ENV === "production"

const optimization = () => {

	const config = {
		splitChunks: {
			chunks: "all"
		}
	}

	if (isProd) {
		config.minimizer = [
			new TerserWebpackPlugin()
		]
	}

	return config
}

module.exports = {
	entry: {
		main: path.resolve(__dirname, "./entry.ts"),
	},
	output: {
		path: path.resolve(__dirname, "./dist"),
		filename: isProd ? "[name].[contenthash].js" : "[name].js"
	},
	module: {
		rules: [
			{
				test: /\.(ts|tsx|js|jsx|cjs)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							"@babel/preset-env",
							["@babel/preset-react", { "runtime": "automatic", "importSource": "@emotion/react" }],
							"@babel/preset-typescript"
						]
					}
				},

			},
			{
				test: /\.svg$/i,
				issuer: /\.[jt]sx?$/,
				use: [{ loader: "@svgr/webpack", options: { icon: true } }],
			},
			{
				test: /\.(png|jpg|gif)$/,
				use: ["file-loader"]
			},
			{
				test: /\.css$/i,
				use: ["style-loader", "css-loader"],
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/i,
				use: 'file-loader',
			},
		]
	},
	resolve: {
		modules: ['node_modules', './node_modules', path.resolve('./modules')],
		extensions: [".*", ".ts", ".tsx", ".js",],
		alias: {
			"@libs": path.resolve(__dirname, './libs')
		}
	},
	plugins: [
		new CleanWebpackPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new HtmlWebpackPlugin({
			template: "./index.html",
			minify: {
				collapseWhitespace: isProd
			}
		}),
		new CopyWebpackPlugin({
			patterns: [
				{
					from: path.resolve(__dirname, "modules/platform/src/shared/assets/icons"),
					to: path.resolve(__dirname, "dist")
				}
			]
		})
	],
	optimization: optimization(),
	devServer: {
		port: 4000,
		hot: true,
		historyApiFallback: { disableDotRule: true }
	},
	mode: isProd ? "production" : "development"
}