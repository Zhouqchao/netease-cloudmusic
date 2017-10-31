const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	entry: {
		index:'./src/js/index.js',
		playlist:'./src/js/playlist.js',
		song:'./src/js/song.js'
	},
	output: {
		path: path.resolve(__dirname,'dist'),
		filename: 'js/[name]-[chunkhash].js'
	},
	module:{
		rules:[
			{
				test:/\.js$/,
				loader:'babel-loader',
				exclude:path.resolve(__dirname,'node_modules'),
				include:path.resolve(__dirname,'src')
			},
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
						// publicPath:'http://127.0.0.1:8080/dist/'
						publicPath:'http://zhouqichao.com/netease-cloudmusic/dist/'
					}
				}
			}
		]
	},
	resolve:{
		"extensions":['.js','.css']
	},
	devtool:"source-map",
	plugins:[
		new HtmlWebpackPlugin({
			// filename:'index-[hash].html',
			filename:'index.html',
			template:'src/index.html',
			favicon:'src/favicon.ico',
			minify:{
				removeComments:true,
				collapseInlineTagWhitespace:true,
				minifyCSS:true
			},
			chunks:['index']
		}),
		new HtmlWebpackPlugin({
			// filename:'playlist-[hash].html',
			filename:'playlist.html',
			template:'src/playlist.html',
			favicon:'src/favicon.ico',
			minify:{
				removeComments:true,
				collapseInlineTagWhitespace:true,
				minifyCSS:true
			},
			chunks:['playlist']
		}),
		new HtmlWebpackPlugin({
			// filename:'song-[hash].html',
			filename:'song.html',
			template:'src/song.html',
			favicon:'src/favicon.ico',
			minify:{
				removeComments:true,
				collapseInlineTagWhitespace:true,
				minifyCSS:true
			},
			chunks:['song']
		}),
		new webpack.optimize.UglifyJsPlugin(),
		new ExtractTextPlugin("css/[name].css")
	]

}