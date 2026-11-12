'use strict';

const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

console.log('Creating production bundle');

module.exports = merge(common, {
	mode: 'production',
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
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
		minimize: true,
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					mangle: false,
					compress: {
						drop_console: true,
						drop_debugger: true,
						pure_funcs: ['console.log', 'console.info', 'console.debug'],
					},
					format: {
						comments: false,
					},
				},
				extractComments: false,
			}),
			new CssMinimizerPlugin({
				minimizerOptions: {
					preset: [
						'default',
						{
							discardComments: { removeAll: true },
							normalizeWhitespace: true,
						},
					],
				},
			}),
		],
		splitChunks: {
			chunks: 'all',
			maxInitialRequests: 25,
			minSize: 20000,
		},
	},
	performance: {
		hints: 'warning',
		maxEntrypointSize: 512000,
		maxAssetSize: 512000,
	},
});
