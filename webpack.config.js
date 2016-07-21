var webpack = require('webpack');
var path = require('path');
let env = process.env.NODE_ENV === 'production' ? 'production': 'development';

let baseConfig = {
    plugins: [
        new webpack.ProvidePlugin({
            riot: 'riot'
        })
    ],
    resolve: {
        extensions: ['', '.js'],
        root: __dirname,
        alias: {
            'riot-form': '../../node_modules/riot-form-mixin/lib/validator',
            'riot-redux': '../../../client/framework/riot-redux',
            'moment': '../../../client/framwork/moment'
        }
    },
    module: {
        preLoaders: [
            {
                test: /\.html$/,
                exclude: /node_modules/,
                loader: 'riotjs-loader',
                query: { type: 'babel' , compact: true}
            }
        ],
        loaders: [
            {
                test: /\.js$/,
                include: /client/,
                loader: 'babel',
                query: {compact: true}
            },
            {
                test: /\.scss$/,
                loader: 'style!css!sass'
            }
        ]
    },
    node: {
        net: 'mock',
        dns: 'mock',
        fs: 'empty'
    }
};

let proConfig = {
    entry: [
        'babel-regenerator-runtime',
        'whatwg-fetch', 
        './client/app/main.js'
    ],
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false },
            comments: false,
            sourceMap: false,
            mangle: true,
            minimize: true
        }),
    ],
    output: {
        path: path.resolve(__dirname, './public/js'),
        filename: 'bundle.js'
    }
}

let devConfig = {
    entry: [
        'babel-regenerator-runtime',
        'webpack-dev-server/client?http://0.0.0.0:8080',
        'whatwg-fetch', 
        './client/app/main.js'
    ],
    devtool: 'eval',
    output: {
        path: path.resolve(__dirname, './public/js'),
        filename: 'bundle.js',
        publicPath: 'http://0.0.0.0:8080/client/app/'
    },
    devServer: {
        host: '0.0.0.0',
        port: 8080,
        historyApiFallback: true,
        contentBase: './client',
        hot: true
    }
}

switch(env){
    case 'production':
        proConfig.plugins = proConfig.plugins.concat(baseConfig.plugins);
        mixin(baseConfig, proConfig);
        break;
    case 'development':
        mixin(baseConfig, devConfig);
        break;
}

/**
 * Helper functions
 */
function mixin (t, s){
    for(var p in s){
        t[p] = s[p]
    }
}

module.exports = baseConfig;
