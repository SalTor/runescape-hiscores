'use strict';

const webpack = require('webpack')

module.exports = (env, argv) => {
    let production = argv.mode === 'production'

    const babelOptions = {
        'presets': [
            '@babel/preset-env', '@babel/react'
        ]
    }

    const config = {
        entry: './source/javascript/index.js',
        mode: production ? 'production' : 'development',
        output: {
            filename: 'rshiscores-bundle.js',
            path: __dirname + '/public/build/js',
            publicPath: 'build/js'
        },
        devServer: {
            contentBase: './public'
        },
        devtool: production ? 'source-map' : 'cheap-module-eval-source-map',
        module: {
            rules: [
                {
                    test: /\.ts(x?)$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: babelOptions
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
                            options: babelOptions
                        }
                    ]
                },
                {
                    test: /\.scss/,
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
                    test: /\.css/,
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
        resolve: {
            extensions: [ '.ts', '.tsx', '.js' ]
        },
        plugins: [],
    }

    if (production) {
        config.resolve.alias = {
            'react': 'preact/compat',
            'react-dom': 'preact/compat'
        }
    }

    return config
}