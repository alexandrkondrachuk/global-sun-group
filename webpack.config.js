const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const distFolder = 'dist';
const mainFolder = 'src';
const imagesFolder = 'images/';
const fontsFolder = 'fonts/';

module.exports = {
    entry: `./${mainFolder}/index.js`,
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            }, {
                test: /\.s[ac]ss$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            }, {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loader: 'file-loader',
                options: {
                    esModule: false,
                    name: '[name].[ext]',
                    outputPath: imagesFolder
                }
            }, {
                test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: fontsFolder
                        }
                    }
                ]
            }, {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: {
                            root: path.resolve(__dirname, mainFolder)
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js']
    },
    output: {
        path: path.resolve(__dirname, distFolder),
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: path.resolve(__dirname, distFolder),
        port: 3000
    },
    plugins: [
        new HtmlWebpackPlugin(),
        new HtmlWebpackPlugin({filename: 'index.html', template: 'src/index.html'}),
        new MiniCssExtractPlugin({filename: 'style.css'}),
        new CopyPlugin({
            patterns: [
                { from: 'src/public', to: 'public' },
            ],
        }),
    ]
};