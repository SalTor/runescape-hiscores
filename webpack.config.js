'use strict';

const babel_options = {
    "presets": [
        "react", [ "es2015", { "modules": false } ], "es2016"
    ]
}

const config = {
    entry: "./source/javascript/react-app.js",
    output: {
        filename: "rshiscores-bundle.js",
        path: __dirname + "/public/build/js",
        publicPath: "build/js"
    },
    devServer: {
        contentBase: "./public",
        historyApiFallback: true
    },
    devtool: "cheap-module-eval-source-map",
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "babel-loader",
                        options: babel_options
                    },
                    { loader: "ts-loader" }
                ]
            },
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "babel-loader",
                        options: babel_options
                    }
                ]
            },
            {
                test: /\.scss/,
                use: [
                    { loader: "style-loader" },
                    { loader: "css-loader" },
                    {
                        loader: "postcss-loader",
                        options: {
                            plugins: function () {
                                return [
                                    require('precss'),
                                    require('autoprefixer')
                                ]
                            }
                        }
                    },
                    { loader: "sass-loader" }
                ]
            },
            {
                test: /\.css/,
                loaders: ["style-loader", "css-loader"]
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: "url-loader",
                options: {
                    limit: 10000
                }
            }
        ]
    },
    resolve: {
        extensions: [ ".ts", ".tsx", ".js" ]
    }
}

module.exports = config
