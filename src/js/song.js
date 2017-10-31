import '../css/song.css';
import AV from '../lib/av-min';
import '../lib/amfe-flexible.min';
import $ from '../lib/jquery.min';

$(function(){

	var Player = (function(){
		var Player = function($ct){
			this.$ct = $ct;
			this.init();
			this.linkToLeanCloud();
			this.getSongData();
			// this.bindEvent();
		}

		Player.prototype.linkToLeanCloud = function(){
			var APP_ID = 'DBDdgDjhDUF86XBUsX2Ql15X-gzGzoHsz';
			var APP_KEY = 'tAQUlyLMWrsge4kJQRP4WlV7';

			AV.init({
			  appId: APP_ID,
			  appKey: APP_KEY
			});			
		}	

		Player.prototype.init = function(){
			this.$page = this.$ct.find('.page');
			this.$discCt = this.$ct.find('.disc-container');
			this.$needleCt = this.$ct.find('.needle-ct');
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
			// var searchParams = new URLSearchParams(window.location.search);
			// this.id = searchParams.get('id');	移动端不支持，会报错
			this.id = location.search.slice(1).split('=')[1];
			this.audio = document.createElement('audio');
		}

		Player.prototype.getSongData = function(){
			var _this = this;

			var query = new AV.Query('Song');
			query.get(_this.id).then(function (songInfo) {

			  	var song = songInfo.attributes;
			  	//设置网页title
			  	document.title = song.name;
			  	//在这里调用
				_this.renderSong(song);
				_this.renderLyric(song);
				_this.$page.show();
				_this.bindEvent();
			});		
		}
		//渲染歌曲
		Player.prototype.renderSong = function(song){
			this.$coverImg.attr('src',song.cover);
			this.$page.css({
				'background-image':"url('"+song.bg+"')"
			});

			this.audio.src = song.url;
			this.audio.setAttribute('preload','auto');
			this.$songTitle.text(song.name+' - '+song.singer);		
		}
		//渲染歌词
		Player.prototype.renderLyric = function(song){
			var _this = this;

		  	var sentences = [];	
		  	if(!song.lyric){
	  			var $p ='<p class="song-pure">纯音乐，无歌词</p>';
	  			_this.$lyric.children('.lines').append($p);
	  			return;
		  	}
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

		  	sentences.forEach(function(obj){
		  		if(!obj){
		  			return;
		  		}
		  		var $p = $('<p></p>');
		  		$p.attr('data-time',obj.time).text(obj.lyric);
		  		$p.appendTo(_this.$lyric.find('.lines'));
		  	})

			this.$lines = this.$ct.find('.lines p');
		  	this.$lines.eq(0).addClass('highlight');
			this.getCertainLine(sentences);
		}

		Player.prototype.getCertainLine = function(sentences){
			var _this = this;
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
			  			var offset = whichLineTop-linesTop - _this.$lyric.height() / 3 < 0 ? 0 :whichLineTop-linesTop - _this.$lyric.height() / 3;
			  			_this.$lyric.find('.lines').css({
			  				'transform':"translateY("+ -offset +"px)"
			  			})
			  			$whichLine.addClass('highlight').siblings().removeClass('highlight');
			  		}
					break;
				}
			}
			setTimeout(function(){
				_this.getCertainLine(sentences);
			},300)		
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
				var needleTransform = getComputedStyle(_this.$needle[0]).transform;
				var needleCtTransform = getComputedStyle(_this.$needleCt[0]).transform;
				_this.$needleCt[0].style.transform =needleCtTransform === 'none' ?
				needleTransform : needleTransform.concat(' ',needleCtTransform);
				console.log(_this.$needleCt[0].style.transform); 
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
