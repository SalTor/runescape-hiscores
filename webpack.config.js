'use strict';

const webpack = require('webpack')

const env_prod = process.env.NODE_ENV === 'production'
const plugins = []
const resolve = {
    extensions: ['.ts', '.tsx', '.js']
}
const babel_options = {
    presets: [
        'react', ['env', { 'modules': false }]
    ]
}

if (env_prod) {
    plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                dead_code: true,
                conditionals: true,
                booleans: true,
                unused: true,
                if_return: true,
                join_vars: true
            },
            output: {
                comments: false
            }
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        })
    )

    resolve.alias = {
        'react': 'preact-compat',
        'react-dom': 'preact-compat'
    }
}

module.exports = {
    entry: './source/javascript/react-app.js',
    output: {
        filename: 'rshiscores-bundle.js',
        path: __dirname + '/public/build/js',
        publicPath: 'build/js'
    },
    devServer: {
        contentBase: './public'
    },
    devtool: env_prod ? 'source-map' : 'cheap-module-eval-source-map',
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: babel_options
                    },
                    { loader: 'ts-loader' }
                ]
            },
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: babel_options
                    }
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: function () {
                                return [
                                    require('precss'),
                                    require('autoprefixer')
                                ]
                            }
                        }
                    },
                    { loader: 'sass-loader' }
                ]
            },
            {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'url-loader',
                options: {
                    limit: 10000
                }
            }
        ]
    },
    plugins, resolve
}