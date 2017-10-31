import '../css/playlist.css';
import AV from '../lib/av-min';
import '../lib/amfe-flexible.min';
import $ from '../lib/jquery.min';

$(function(){

	var GetPlayList = (function(){
		var GetPlayList = function($ct){
			this.$ct = $ct;
			this.init();
			this.getPlayListData();
			this.getSongListData();
			this.bindEvent();
		}	

		GetPlayList.prototype.init = function(){
			this.$bgImgCt = this.$ct.find('header .background-image');
			this.$headLeftImg = this.$ct.find('.head-left img');
			this.$headLeftView = this.$ct.find('.head-left .view');
			this.$headRightTitle = this.$ct.find('.head-right .title');
			this.$headRightAvatar = this.$ct.find('.head-right .avatar');
			this.$headRightCreator = this.$ct.find('.head-right .creator');
			this.$tag = this.$ct.find('.tag');
			this.$tagList = this.$ct.find('.tagList');
			this.$briefText = this.$ct.find('.brief .text');
			this.$downBtn = this.$ct.find('.down');
			this.$songList = this.$ct.find('.songList ul');
			this.$loadingImg = this.$ct.find('.loading');
			this.$tag = this.$ct.find('.tag');	
		}

		GetPlayList.prototype.getPlayListData = function(){

			var _this=this;

			// 1.连接到Lean Cloud
			var APP_ID = 'DBDdgDjhDUF86XBUsX2Ql15X-gzGzoHsz';
			var APP_KEY = 'tAQUlyLMWrsge4kJQRP4WlV7';

			AV.init({
			  appId: APP_ID,
			  appKey: APP_KEY
			});	

			//获取id
			var id = location.search.slice(1).split('=')[1];
			// var searchParams = new URLSearchParams(window.location.search);
			// var id = searchParams.get('id');	移动端不支持，会报错
			//根据id获取到playList信息，渲染header
			var queryList = new AV.Query('playList');
			queryList.get(id).then(function(listInfo){
				var list = listInfo.attributes;
				_this.renderPlayList(list);
			}, function (error) {
		  		alert('获取歌单失败');
		    })		
		}

		GetPlayList.prototype.renderPlayList = function(list){
			var _this = this;

			//设置网页title
			document.title= list.description;

			//设置header背景图片
			this.$bgImgCt.css('background-image','url("'+list.bg+'")');

			this.$headLeftImg.attr('src',list.picture);
			this.$headLeftView.text(list.view);
			this.$headRightTitle.text(list.description);
			this.$headRightAvatar.attr('src',list.avatar);
			this.$headRightCreator.text(list.creator);

			var tagList = JSON.parse(list.tag);
			this.$tag.prepend('<p>标签：</p>');

			tagList.forEach(function(tag){
				var html="<em>"+ tag + "</em>";
				_this.$tagList.append(html);
			})

			var briefArr = list.brief.split('i');
			briefArr.forEach(function(value,index){
				var $item = $('<span></span><br>');
				$item.text(value);
				_this.$briefText.append($item);
			})
			this.$songList.prepend('<h3 class="title">歌曲列表</h3>');
		}

		GetPlayList.prototype.bindEvent = function(){
			var _this = this;

			this.$downBtn.on('click',function(){
				_this.$briefText.toggleClass('whole-text');
				_this.$downBtn.toggleClass('whole-text');
			})
			this.$briefText.on('click',function(){
				_this.$downBtn.trigger('click');
			})		
		}


		GetPlayList.prototype.getSongListData = function(){
			var _this = this;

			var querySongList = new AV.Query('Song');
			querySongList.find().then(function (results) {
				var songs = [];
			    results.forEach(function(item,index){
			    	songs.push(item.attributes);
			    	songs[index].id = item.id;
			    })	
		    	_this.renderSongList(songs);
		    }, function (error) {
		  		alert('获取歌曲列表失败');
		    });		
		}

		GetPlayList.prototype.renderSongList = function(songs){
			var _this = this;
		
			songs.forEach(function(song,index){
				var ranking = index+1;
			  	var html = '<li>'
			  					+'<span data-ranking='+ ranking+'></span>'
								+'<a href="./song.html?id='+ song.id+'">'
								+'<h3>'+song.name+'</h3>'
								+'<p>'
									+'<span>'+song.singer+ ' - ' + song.name+'</span>'
								+'</p>'
								+'<svg class="icon-play-circled" aria-hidden="true">'
								    +'<use xlink:href="#icon-play-circled-copy"></use>'
								+'</svg>'
								+'</a>'
							+'</li>';
				_this.$songList.append(html);

				var $ranking = $('.songList li>span');
				$ranking.eq(index).text($ranking.eq(index).attr('data-ranking'));
			})

			this.$ct.show().removeClass('bg-color');
		}

		return GetPlayList;
	})();

	new GetPlayList($('.page'));
})	