const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const distFolder = 'dist';
const mainFolder = 'src';
const imagesFolder = 'images/';
const fontsFolder = 'fonts/';

module.exports = (env, argv) => (
    {
        entry: `./${mainFolder}/index.js`,
        module: {
            rules: [
                {
                    test: /\.(js)$/,
                    exclude: /node_modules/,
                    use: ['babel-loader']
                }, {
                    test: /\.(css|sass|scss)$/,
                    use: [
                        argv.mode === 'development'
                            ? 'style-loader'
                            : MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 2,
                                sourceMap: true,
                            },
                        },
                        {
                            loader: 'postcss-loader'
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true,
                            },
                        },
                    ],
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
            new HtmlWebpackPlugin({filename: 'our-power-plants.html', template: 'src/our-power-plants.html'}),
            new HtmlWebpackPlugin({filename: 'about-us.html', template: 'src/about-us.html'}),
            new HtmlWebpackPlugin({filename: 'faq.html', template: 'src/faq.html'}),
            new HtmlWebpackPlugin({filename: 'team.html', template: 'src/team.html'}),
            new HtmlWebpackPlugin({filename: 'contacts.html', template: 'src/contacts.html'}),
            new HtmlWebpackPlugin({filename: 'log-in.html', template: 'src/log-in.html'}),
            new HtmlWebpackPlugin({filename: 'registration.html', template: 'src/registration.html'}),
            new MiniCssExtractPlugin({filename: 'style.css'}),
            new CopyPlugin({
                patterns: [
                    { from: 'src/public', to: 'public' },
                ],
            }),
        ]
    }
);