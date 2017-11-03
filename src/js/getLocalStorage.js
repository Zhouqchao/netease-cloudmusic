// var $ = require('../lib/jquery.min');
import $ from '../lib/jquery.min';

module.exports = (function(){
		function GetLocalStorage($ct){
			this.$ct = $ct;

			this.init();
			this.renderHistoryList();
			this.bindEvent();
		}

		//初始化变量
		GetLocalStorage.prototype.init = function(){
			this.$historyList = this.$ct.find('.historyRecord');
			this.$input = this.$ct.find('input');
			this.value = null;
			this.songs = (localStorage.getItem('songs') == null ? [] : JSON.parse(localStorage.getItem('songs')));//页面加载获取localStorage
		}

		//绑定事件
		GetLocalStorage.prototype.bindEvent = function(){
			var _this = this;
			
			//给input绑定keypress事件，按下键盘enter键时触发
			this.$input.on('keypress',function(e){
				if(e.which === 13){ 
					_this.value= $(this).val().trim();
					if(_this.value === '' || _this.value ===_this.songs[_this.songs.length-1]){
						return false;
					}
					_this.songs.push(_this.value);

					localStorage.setItem('songs',JSON.stringify(_this.songs));

					_this.$historyList.empty();

					_this.renderHistoryList();
				}
			}),

			//给class="remove"按钮绑定click事件，删除搜索记录
			this.$historyList.on('click','.remove',function(e){
				e.stopPropagation(); //阻止时间冒泡，即阻止触发$historyList中的li点击事件
				//更新songs
				var beRemoved = $(this).parent().text();

				for(var i=_this.songs.length-1;i>=0;i--){
					if(_this.songs[i] === beRemoved){
						_this.songs.splice(i,1); //有bug：当历史记录中有多个相同记录时，点击删除会同时删除多个相同的记录
					}
				}
				//更新localStorage
				localStorage.setItem('songs',JSON.stringify(_this.songs));
				_this.$historyList.empty();
				_this.renderHistoryList();
			})			
		}

		//渲染搜索记录列表
		GetLocalStorage.prototype.renderHistoryList = function(){
			var _this = this;

			if(this.songs.length !== 0){
				this.songs.forEach(function(song,index){
					var html = '<li>'+song+'<span class="remove"><span></li>';
					_this.$historyList.prepend(html);
				})
			}
		}

	return GetLocalStorage;
})();

// new GetLocalStorage($('body'));