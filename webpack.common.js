'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
	entry: './app/scripts/index',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].[contenthash].js',
		chunkFilename: '[name].[contenthash].chunk.js',
		clean: true,
		publicPath: '/',
	},
	resolve: {
		extensions: ['.js', '.json', '.jsx', '.css', '.html', '.scss'],
		alias: {
			'~': path.resolve(__dirname, 'app'),
			'@': path.resolve(__dirname, 'app/scripts'),
		},
	},
	target: 'web',
	module: {
		rules: [
			{
				test: /\.(ttf|eot|woff|woff2|svg)$/,
				type: 'asset/resource',
				generator: {
					filename: 'fonts/[name].[hash][ext]',
				},
			},
			{
				test: /\.(png|jpg|jpeg|gif|ico)$/,
				type: 'asset',
				parser: {
					dataUrlCondition: {
						maxSize: 8192,
					},
				},
				generator: {
					filename: 'images/[name].[hash][ext]',
				},
			},
			{
				test: /\.m?js$/,
				exclude: /node_modules/,
				include: [path.resolve(__dirname, 'app')],
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							[
								'@babel/preset-env',
								{
									targets: {
										browsers: ['last 2 versions', 'not dead', 'not IE 11'],
									},
									modules: false,
								},
							],
						],
					},
				},
			},
			{
				test: /\.html$/,
				use: [
					{
						loader: 'html-loader',
						options: {
							minimize: false,
							esModule: false,
						},
					},
				],
			},
		],
	},
	optimization: {
		moduleIds: 'deterministic',
		runtimeChunk: 'single',
		splitChunks: {
			chunks: 'all',
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors',
					chunks: 'all',
					priority: 10,
				},
				angular: {
					test: /[\\/]node_modules[\\/]angular/,
					name: 'angular',
					chunks: 'all',
					priority: 20,
					enforce: true,
				},
				bootstrap: {
					test: /[\\/]node_modules[\\/](bootstrap|jquery|popper.js)[\\/]/,
					name: 'bootstrap',
					chunks: 'all',
					priority: 20,
				},
				charts: {
					test: /[\\/]node_modules[\\/](chart.js|d3)[\\/]/,
					name: 'charts',
					chunks: 'all',
					priority: 15,
				},
				common: {
					name: 'common',
					minChunks: 2,
					chunks: 'all',
					priority: 5,
					reuseExistingChunk: true,
				},
			},
		},
	},
	plugins: [
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			'window.jQuery': 'jquery',
		}),
		new HtmlWebpackPlugin({
			template: 'app/template.html',
			minify: false,
			inject: true,
		}),
		new MiniCssExtractPlugin({
			filename: 'styles.[contenthash].css',
			chunkFilename: 'styles.[contenthash].chunk.css',
		}),
		new CopyWebpackPlugin({
			patterns: [
				{ from: 'app/404.html' },
				{ from: 'app/favicon.ico' },
				{ from: 'app/robots.txt' },
				{
					context: 'app/config',
					from: '*',
					to: 'config/',
				},
				{
					from: 'app/images',
					to: 'images/',
					noErrorOnMissing: true,
				},
				{
					from: 'app/fonts',
					to: 'fonts/',
					noErrorOnMissing: true,
				},
			],
		}),
	],
};
