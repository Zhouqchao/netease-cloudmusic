$(function(){

	var Player = (function(){
		var Player = function($ct){
			this.$ct = $ct;
			this.init();
			this.bindEvent();
		}

		Player.prototype.init = function(){
			this.$page = this.$ct.find('.page');
			this.$discCt = this.$ct.find('.disc-container');
			this.$cover = this.$ct.find('.cover');
			this.$coverImg = this.$ct.find('.cover img'); 
			this.$light = this.$ct.find('.disc-container .light');
			this.$needle = this.$ct.find('.needle');
			this.$iconWrapper = this.$ct.find('.icon-wrapper');
			this.$iconPlay = this.$ct.find('.icon-play');
			this.$iconPause = this.$ct.find('.icon-pause');

			this.$songTitle = this.$ct.find('.song-description h1'); 	
			this.$lyric = this.$ct.find('.lyric');
			this.sentenceList = null;
			this.song = null;		
			var searchParams = new URLSearchParams(window.location.search);
			this.id = searchParams.get('id');	
			this.audio = document.createElement('audio');

			this.getSongData();
			// this.renderSong();
			// this.renderLyric();
			// window.setInterval(this.getCertainLine(),300);
		}

		Player.prototype.getSongData = function(){
			var _this = this;

			var APP_ID = 'DBDdgDjhDUF86XBUsX2Ql15X-gzGzoHsz';
			var APP_KEY = 'tAQUlyLMWrsge4kJQRP4WlV7';

			AV.init({
			  appId: APP_ID,
			  appKey: APP_KEY
			});		
			var query = new AV.Query('Song');
			query.get(_this.id).then(function (songInfo) {

			  	var song = songInfo.attributes;
			  	//设置网页title
			  	document.title = song.name;
			  	//在这里调用
				_this.renderSong(song);
				_this.renderLyric(song);
				_this.$page.show();
			});		
		}
		//渲染歌曲
		Player.prototype.renderSong = function(song){
			this.$coverImg.attr('src',song.cover);
			// this.$iconWrapper.animate({'opacity':0},2000);
			this.$page.css({
				'background-image':"url("+song.bg+")"
			});

			this.audio.src = song.url;
			this.$songTitle.text(song.name+' - '+song.singer);		
		}
		//渲染歌词
		Player.prototype.renderLyric = function(song){
			var _this = this;

		  	var sentences = [];
		  	var parts = song.lyric.split('\n');
		  	parts.forEach(function(part,index){
		  		var sentence = part.split(']');
		  		sentence[0] = sentence[0].slice(1);
		  		var reg = /(\d+):([\d.]+)/;
		  		var matches = sentence[0].match(reg);
		  		if(matches){
			  		var minutes = parseFloat(matches[1]);
			  		var seconds = parseFloat(matches[2]);

			  		sentences.push({
			  			time:minutes*60+seconds,
			  			lyric:sentence[1]
			  		});	  			
		  		}
		  	})

		  	sentences.map(function(obj){
		  		if(!obj){
		  			return;
		  		}
		  		var $p = $('<p></p>');
		  		$p.attr('data-time',obj.time).text(obj.lyric);
		  		$p.appendTo(_this.$lyric.children('.lines'));
		  	})

			this.$lines = this.$ct.find('.lines p');
			window.setInterval(function(){
				_this.getCertainLine(sentences);
			},300);
		}

		Player.prototype.getCertainLine = function(sentences){
			var _this = this;
		  	this.$lines.eq(0).addClass('highlight');	
			var $whichLine;
		  	var curTime = this.audio.currentTime;
			for(var i=0;i<sentences.length;i++){
					var $curLineTime = this.$lines.eq(i).attr('data-time');
					var $nextLineTime = this.$lines.eq(i+1).attr('data-time');
				if(this.$lines.eq(i+1).length !== 0 && $curLineTime < curTime && $nextLineTime > curTime){
					$whichLine = _this.$lines.eq(i);
			  		if($whichLine){
			  			var whichLineTop = $whichLine.offset().top;
			  			var linesTop = $('.lines').offset().top;
			  			var offset = whichLineTop-linesTop - _this.$lyric.height() / 3;
			  			$('.lines').css({
			  				'transform':"translateY("+ -offset +"px)"
			  			})
			  			$whichLine.addClass('highlight').siblings().removeClass('highlight');
			  		}
					break;
				}
			}		
		}
		Player.prototype.bindEvent = function(){
			var _this = this;

			// this.audio.autoplay = 'autoplay';
			//为了用户流量考虑，手机默认禁用autoplay,
			// this.audio.oncanplay = function(){
			// 	_this.audio.play();
			// 	_this.$discCt.addClass('playing');
			// }

			this.$discCt.removeClass('playing');
			this.$needle.addClass('needle-rotate');
			//设置播放暂停动画
			this.$iconPause.on('click',function(){
				_this.audio.pause();
				_this.$iconWrapper.css('opacity',1);
				_this.$discCt.removeClass('playing');
				_this.$needle.addClass('needle-rotate');
			})

			this.$iconPlay.on('click',function(){
				_this.audio.play();
				_this.$discCt.addClass('playing');
				_this.$iconWrapper.animate({'opacity':0},2000);

				_this.$needle.removeClass('needle-rotate');
			})

			this.audio.addEventListener('ended',function(){
				_this.$cover.css({
					'transform':'rotate(0deg)'
				})
				_this.$light.css({
					'transform':'rotate(0deg)'
				})
				_this.$discCt.removeClass('playing');

				_this.$needle.addClass('needle-rotate');
			})
			this.$cover.on('click',function(){
				_this.$iconPause.trigger('click');
			})			
		}	

		return Player;	
	})();

	new Player($('body'));
})
	//声明变量
	// var songData;
	// var sentenceList;
	// var $page = $('.page');
	// var $discCt = $('.disc-container');
	// var $cover = $('.disc-container .cover');
	// var $coverImg = $('.disc-container .cover img');
	// var $light = $('.disc-container .light');
	// var $needle = $('.needle');
	// var $iconWrapper = $('.icon-wrapper');
	// var $iconPlay = $('.icon-play');
	// var $iconPause = $('.icon-pause');

	// var $songTitle = $('.song-description h1'); 	
	// var $lyric = $('.lyric');
	// var $lines = $('.lines p');



	// //1. 创建audio
	// var audio = document.createElement('audio');
	// //2. 连接LeanCloud
	// var APP_ID = 'DBDdgDjhDUF86XBUsX2Ql15X-gzGzoHsz';
	// var APP_KEY = 'tAQUlyLMWrsge4kJQRP4WlV7';

	// AV.init({
	//   appId: APP_ID,
	//   appKey: APP_KEY
	// });		

	//3. 获取歌曲id
	//var id = location.search.slice(1).split('=')[1];
	// var searchParams = new URLSearchParams(window.location.search);
	// var id = searchParams.get('id');

	//4. 根据歌曲id获取对应的歌曲信息
	// getSongData();
	// //5. 渲染歌曲
	// renderSong(songData);
	// //6. 渲染歌词
	// renderLyric(songData);
	// //7. 实时滚动并高亮歌词
	// setInterval(function(){
	// 	getCertainLine();
	// },300);	
	// //8. 绑定歌曲播放/暂停事件
	// bindEvent();


	//获取歌曲信息
	// function getSongData(){
	// 	var query = new AV.Query('Song');
	// 	query.get(id).then(function (songInfo) {

	// 	  	= songInfo.attributes;
	// 	  	console.log(songData);
	// 	});
	//  }

	//渲染歌曲
	// function renderSong(song){
	// 	console.log(song.cover);
	// 	$('.disc-container .cover img').attr('src',song.cover);
	// 	$iconWrapper.animate({'opacity':0},2000);
	// 	$page.css({
	// 		'background-image':`url('${song.bg}')`
	// 	});

	// 	audio.src = song.url;
	// 	$songTitle.text(song.name+' - '+song.singer);
	// }

	//渲染歌词
	// function renderLyric(song){ 
	//   	var sentences = [];
	//   	var parts = song.lyric.split('\n');
	//   	parts.forEach(function(part,index){
	//   		var sentence = part.split(']');
	//   		sentence[0] = sentence[0].slice(1);
	//   		var reg = /(\d+):([\d.]+)/;
	//   		var matches = sentence[0].match(reg);
	//   		if(matches){
	// 	  		var minutes = parseFloat(matches[1]);
	// 	  		var seconds = parseFloat(matches[2]);

	// 	  		sentences.push({
	// 	  			time:minutes*60+seconds,
	// 	  			lyric:sentence[1]
	// 	  		});	  			
	//   		}
	//   	})


	//   	sentences.map(function(obj){
	//   		if(!obj){
	//   			return;
	//   		}
	//   		var $p = $('<p></p>');
	//   		$p.attr('data-time',obj.time).text(obj.lyric);
	//   		$p.appendTo($lyric.children('.lines'));
	//   	})

	//   sentenceList = sentences;
	// }

	//实时滚动并高亮歌词	  	
	// function getCertainLine(){
	//   	$lines.eq(0).addClass('highlight');	
	// 	var $whichLine;
	//   	var curTime = audio.currentTime;

	// 	for(var i=0;i<sentenceList.length;i++){
	// 			var $curLineTime = $lines.eq(i).attr('data-time');
	// 			var $nextLineTime = $lines.eq(i+1).attr('data-time');
	// 		if($lines.eq(i+1).length !== 0 && $curLineTime < curTime && $nextLineTime > curTime){
	// 			$whichLine = $lines.eq(i);
	// 	  		if($whichLine){
	// 	  			var whichLineTop = $whichLine.offset().top;
	// 	  			var linesTop = $('.lines').offset().top;
	// 	  			var offset = whichLineTop-linesTop - $('.lyric').height() / 3;
	// 	  			$('.lines').css({
	// 	  				'transform':`translateY(-${offset}px)`
	// 	  			})
	// 	  			$whichLine.addClass('highlight').siblings().removeClass('highlight');
	// 	  		}
	// 			break;
	// 		}
	// 	}
	// }

	// renderSong(song);
	// renderLyric(song);
	// setInterval(function(){
	// 	getCertainLine();
	// },300);

	//绑定歌曲播放/暂停事件
	// function bindEvent(){
	// 	// 设置自动播放音乐
	// 	audio.autoplay = 'autoplay';
	// 	//手机有些情况oncanplay不会自动播放
	// 	audio.oncanplay = function(){
	// 		audio.play();
	// 		$discCt.addClass('playing');
	// 	}

	// 	//设置播放暂停动画
	// 	$iconPause.on('click',function(){
	// 		audio.pause();
	// 		$iconWrapper.css('opacity',1);
	// 		$discCt.removeClass('playing');
	// 		$needle.addClass('needle-rotate');
	// 	})

	// 	$iconPlay.on('click',function(){
	// 		audio.play();
	// 		$discCt.addClass('playing');
	// 		$iconwrapper.animate({'opacity':0},2000);

	// 		$needle.removeClass('needle-rotate')
	// 	})

	// 	audio.addEventListener('ended',function(){
	// 		$cover.css({
	// 			'transform':'rotate(0deg)'
	// 		})
	// 		$light.css({
	// 			'transform':'rotate(0deg)'
	// 		})
	// 		$discCt.removeClass('playing');

	// 		$needle.addClass('needle-rotate');
	// 	})
	// 	$cover.on('click',function(){
	// 		$iconPause.trigger('click');
	// 	})	
	// }

