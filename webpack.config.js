const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');


module.exports = (env, argv) => {

    const configuration = argv.mode === 'development' ? development : production;

    return {
        //Point d'entrée JS, fichier qui contiendra les includes.
        entry: {
            app: './assets/js/app.js',

        },
        //Objet contenant le chemin de sortie, ainsi que le nom à donner au fichier
        output: {
            path: path.resolve(__dirname, 'public/build'),
            filename: "./js/[name]-bundle.js",
            publicPath: '/build/',
            clean: true,
        },
        ...configuration,

    }
}

const development = {
    mode: 'development',
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.s?css$/i,
                use: ['style-loader', {
                    loader: 'css-loader',
                    options: {
                        import: true,
                        sourceMap: true,
                    },
                },
                    'sass-loader',

                ],
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'img/[name][ext]',
                }
            },
        ],
    },
    optimization: {
        minimize: false,
    },

}

const production = {
    module: {
        rules: [
            {
                test: /\.s?css$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: "css-loader",
                        options: {
                            import: true,
                            sourceMap: true,
                        },
                    },
                    'sass-loader',
                ],
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'img/[name][ext]',
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env'],
                    plugins: ['@babel/plugin-proposal-object-rest-spread']
                }
            }
        ],
    },

    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin(),
            new TerserPlugin(),
        ],
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: "./styles/[name].styles",
        }),
    ]
}