'use strict';

const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const webpack = require('webpack');

console.log('Creating development bundle');

module.exports = merge(common, {
	mode: 'development',
	devtool: 'eval-source-map',
	devServer: {
		static: {
			directory: path.resolve(__dirname, 'app'),
			publicPath: '/',
		},
		port: 9000,
		open: true,
		hot: true,
		liveReload: true,
		compress: true,
		historyApiFallback: true,
		client: {
			overlay: {
				errors: true,
				warnings: false,
			},
		},
		devMiddleware: {
			writeToDisk: false,
		},
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							importLoaders: 1,
						},
					},
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: [
									[
										'postcss-import',
										{
											path: [
												path.resolve(__dirname, 'app/styles'),
												path.resolve(__dirname, 'node_modules'),
											],
										},
									],
								],
							},
						},
					},
				],
			},
		],
	},
	optimization: {
		minimize: false,
		removeAvailableModules: false,
		removeEmptyChunks: false,
		splitChunks: false,
	},
	plugins: [new webpack.HotModuleReplacementPlugin()],
});
