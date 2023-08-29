const path = require('path');
const Webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const isDesktop = process.env.APP_SCOPE === 'desktop';

let appConfig = require('dotenv').config(isDesktop ? { path: path.resolve(__dirname, '../../.env') } : '');
const envVars = appConfig.parsed;
appConfig = Object.keys(envVars).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(envVars[next]);
    return prev;
}, {});

const NODE_ENV = envVars.NODE_ENV;

console.log(`
--------------------------------------------------
    NODE_ENV: ${NODE_ENV}
--------------------------------------------------
`);

let entryOpt = {
    client: path.resolve(__dirname, '../src/index.tsx'),
}

if (NODE_ENV === 'development') {
    entryOpt = Object.assign({}, entryOpt, { vendor: ['react', 'react-dom'] });
}

const webpackConfig = {
    entry: entryOpt, 
    mode: NODE_ENV === 'development' ? "development" : "production",
    stats: {
        modules: false,
    },
    output: {
        filename: "[name].[contenthash].js",
        chunkFilename: `[name].[contenthash].js`,
        path: path.join(__dirname, "../build/"),
        publicPath: !isDesktop ? "/" : path.join(__dirname, "../build/"),
    },
    resolve: {
        extensions: [".js", ".ts", ".tsx"],
    },
    target: "web",
    devtool: NODE_ENV ? "inline-source-map" : false,
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                loader: 'ts-loader',
                options: {
                    configFile: path.resolve(__dirname, "./tsconfig.client.json"),
                },
            },
            {
                exclude: /node_modules/,
                test: /\.(png|jpg|jpeg|gif|svg|eot|ttf|woff|woff2)$/,
                type: 'asset/resource'
            },
            {
                test: /\.(sass|scss|css)$/,
                exclude: /node_modules/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            },
        ],
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    mangle: true,
                    output: {
                        beautify: false
                    },
                },
            }),
        ],
        splitChunks: NODE_ENV == 'development' ? {
            chunks: 'all',
        } : {},
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
            // chunkFilename: '[id].[contenthash].css',
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "../src/template/index.html"),
            inject: "body",
        }),
        new WebpackManifestPlugin({
            basePath: 'myApp_',
        }),
        new Webpack.DefinePlugin(
            Object.assign({}, appConfig, {
                '__isBrowser__': true,
                '__REACT_DEVTOOLS_GLOBAL_HOOK__': { 
                    isDisabled: true 
                }
            })
        ),
        
    ],
};

if (NODE_ENV === 'development') {
    webpackConfig.devServer = {
        port: envVars && envVars.APP_PORT ? envVars.APP_PORT : 3000, // default to 3000 if none found
        historyApiFallback: {
            index: '/'
        },
        static: [
            { directory: path.join(__dirname, '../build') },
            { directory: path.join(__dirname, '../static'), },
        ],
    }
}

module.exports = webpackConfig;