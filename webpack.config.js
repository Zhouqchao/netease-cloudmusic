var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	entry: {
		// jquery:'./src/lib/jquery.min.js',
		// flexible:'./src/lib/amfe-flexible.min.js',
		// leancloud:'./src/lib/av-min.js',
		index:'./src/js/index.js',
		playlist:'./src/js/playlist.js',
		song:'./src/js/song.js',
		// tabComponent:'./src/js/tab-component.js',
		// localStorage:'./src/js/getLocalStorage.js'
	},
	output: {
		path: path.resolve(__dirname,'dist'),
		filename: 'js/[name]-[chunkhash].js',
		// publicPath:'http://zhouqichao.com/netease-cloudmusic'
	},
	module:{
		rules:[
			// {
			// 	test:/\.js$/,
			// 	loader:'babel-loader',
			// 	exclude:path.resolve(__dirname,'node_modules'),
			// 	include:path.resolve(__dirname,'src'),
			// 	options:{
			// 		presets:['es2015']
			// 	}
			// },
			{
				test:/\.css$/,
				use: ExtractTextPlugin.extract({
					fallback:"style-loader",
					use:'css-loader'
				})
			},
			{
				test:/\.(jpg|jpeg|png|gif|svg|webp)$/,
				use:{
					loader:'file-loader',
					options:{
						name:'[name].[ext]',
						outputPath:'images/',
						publicPath:'http://127.0.0.1:8080/dist/'
					}
				}
			}
		]
	},
	plugins:[
		new HtmlWebpackPlugin({
			// filename:'index-[hash].html',
			filename:'index.html',
			template:'src/index.html',
			minify:{
				removeComments:true
			},
			chunks:['index']
		}),
		new HtmlWebpackPlugin({
			// filename:'playlist-[hash].html',
			filename:'playlist.html',
			template:'src/playlist.html',
			minify:{
				removeComments:true
			},
			chunks:['playlist']
		}),
		new HtmlWebpackPlugin({
			// filename:'song-[hash].html',
			filename:'song.html',
			template:'src/song.html',
			minify:{
				removeComments:true
			},
			chunks:['song']
		}),
		new webpack.optimize.UglifyJsPlugin(),
		new ExtractTextPlugin("css/[name]-[contenthash].css")
	]

}