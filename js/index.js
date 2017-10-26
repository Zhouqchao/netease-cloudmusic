
	// Tab组件 —————— 顶部水平导航栏Tab切换功能
	new Tab(document.querySelector('.page'));
	new GetLocalStorage($('.page'));

	// 连接到Lean Cloud
	// var APP_ID = 'DBDdgDjhDUF86XBUsX2Ql15X-gzGzoHsz';
	// var APP_KEY = 'tAQUlyLMWrsge4kJQRP4WlV7';

	// AV.init({
	//   appId: APP_ID,
	//   appKey: APP_KEY
	// });	

	var RenderIndexPage = function($ct){
		this.$ct = $ct;
		this.init();
		// this.bindEvent();
		this.linkToLeanCloud();
		this.getPlayLists();
		this.getSongsData();
		this.$ct.show();
		this.bindEvent();
	}

	RenderIndexPage.prototype.linkToLeanCloud = function(){
		var APP_ID = 'DBDdgDjhDUF86XBUsX2Ql15X-gzGzoHsz';
		var APP_KEY = 'tAQUlyLMWrsge4kJQRP4WlV7';

		AV.init({
		  appId: APP_ID,
		  appKey: APP_KEY
		});			
	}
	RenderIndexPage.prototype.init = function(){
		this.$latestSongs = this.$ct.find('.latestSongs ul');
		this.$hotSongs = this.$ct.find('.hotMusic .hotMusicList');
		// var $loadingImg = $('.latestSongs .loading');
		// var $hotLoadingImg = $('.hotMusic .loading');
		this.songsData = null;

		this.$hotSearch = this.$ct.find('.searchMusic .hotSearch');
		this.$listImgCt = this.$ct.find('.playLists .img-ct');
		this.$listLink = this.$ct.find('.playLists li a');
		this.$wholeBillboard = this.$ct.find('.wholeBillboard');
		this.$searchInput = this.$ct.find('.searchMusic .search');
		this.$searchHint = this.$ct.find('.searchMusic .searchHint');
		this.$searchHintList = this.$ct.find('.searchHintList');
		this.$searchFinalResult = this.$ct.find('.searchFinalResult');
		this.$historyRecord = this.$ct.find('.historyRecord');
		this.$clearBtn = this.$ct.find('.clear');
		this.$noResult = this.$ct.find('.no-result');
		// this.linkToLeanCloud();
	}

	RenderIndexPage.prototype.getPlayLists = function(){
		var _this = this;

		var queryList = new AV.Query('playList');

		queryList.find().then(function(playLists){

			_this.renderPlayLists(playLists);

		}, function (error) {
	  		alert('获取歌单失败');
	    })		
	}


	RenderIndexPage.prototype.renderPlayLists = function(playLists){
		var _this = this;

		var lists = [];
	    playLists.forEach(function(playList,index){
	    	lists.push(playList.attributes);
	    	lists[index].id = playList.id;
	    })

	    lists.forEach(function(list,index){
	    	var html = '<span class="visits">'+list.view+'</span><img src="'+list.picture+'" alt="">';
	    	var para = '<p>'+list.description+'</p>';

		    _this.$listImgCt.eq(index).append(html);	
		    _this.$listLink.eq(index).append(para);
		    _this.$listLink.eq(index).attr('href',"./playlist.html?id="+list.id);		
	    });		
	}

	RenderIndexPage.prototype.getSongsData = function(){
		var _this = this;

		var query = new AV.Query('Song');
		query.find().then(function (songsData) {
			var songs = [];
			songsData.forEach(function(songData,index){
				songs.push(songData.attributes);
				songs[index].id = songData.id;
			})	
			//渲染最新歌曲
			_this.renderLatestSongs(songs);
			//渲染热门歌曲
			_this.renderHotMusic(songs);
			_this.$ct.show();

		}, function (error) {
				alert('获取歌曲失败');
		});    		
	}

	RenderIndexPage.prototype.renderLatestSongs = function(songs){
		var _this = this;

		songs.forEach(function(song,index){

			var ranking = index+1 < 10 ? '0'+(index+1) : index+1;
		  	var html = '<li>'
		  					+'<span data-ranking='+ranking+'></span>'
							+'<a href="./song.html?id='+song.id+'">'
							+'<h3>'+song.name+'</h3>'
							+'<p><i>'
									+'<svg class="icon-sq" aria-hidden="true">'
									    +'<use xlink:href="#icon-sq""></use>'
									+'</svg>'
								+'</i>'
								+'<span>'+song.singer +' - '+ song.name+'</span>'
							+'</p>'
							+'<svg class="icon-play-circled" aria-hidden="true">'
							    +'<use xlink:href="#icon-play-circled-copy"></use>'
							+'</svg>'
							+'</a>'
						+'</li>';

			_this.$latestSongs.append(html);
			_this.$hotSongs.append(html);

			if(!song.isHot){
				_this.$hotSongs.find('i .icon-sq').eq(index).hide();
				_this.$latestSongs.find('i .icon-sq').eq(index).hide();
				_this.$hotSongs.find('p span').eq(index).css({
					'width':'8.375rem',
					'left':0
				});
				_this.$latestSongs.find('p span').eq(index).css({
					'width':'8.375rem',
					'left':0
				});
			}
			_this.$wholeBillboard.show();

			var $ranking = _this.$hotSongs.find('li>span');
			$ranking.eq(index).text($ranking.eq(index).attr('data-ranking'));
		})
		// $loadingImg.hide();
		// $hotLoadingImg.hide();		
	}

	RenderIndexPage.prototype.bindEvent = function(){
		var _this = this;

		this.$searchInput.on('input',function(){	
			var value = $(this).val().trim();

			if(value === ''){
				_this.$hotSearch.show();
				_this.$historyRecord.show();
				_this.$clearBtn.hide();
			}else{
				_this.$hotSearch.hide();
				_this.$historyRecord.hide();
				_this.$clearBtn.show();
				_this.$searchHint.show().find('span').text('"'+value+'"');				
			} 
		});

		var timer = null;

		this.$searchInput.keyup(function(e){

			if(timer){
				clearTimeout(timer);
			}

			timer = setTimeout(function(){
			 	var value =_this.$searchInput.val();

			 	if(value === ''){
			 		return false;
			 	}else{

				 	_this.$searchHint.show().css('font-size','15px').find('span').text('"'+value+'"');
			
				 	//连接LeanCloud,综合查询
				 	
					var queryName = new AV.Query('Song');
					queryName.contains('name',value);	 
					var querySinger = new AV.Query('Song');
					querySinger.contains('singer',value);
					var query = AV.Query.or(queryName,querySinger);
					query.find().then(function(songsInfo){

						//按下enter,没有找到结果时
						if(e.which === 13 && songsInfo.length === 0){
							_this.$searchInput.blur();		
							_this.$noResult.show();
							_this.$searchHint.hide();
							_this.$searchHintList.hide();
						}
						//没按下enter，并且没有找到结果时
						if(e.which !== 13 && songsInfo.length === 0){
							// _this.$searchFinalResult.hide();
							_this.$searchHintList.empty();
							_this.$searchHintList.append('<li class="listItem">没有结果</li>');
						}
						//没按下enter
						if(e.which !== 13 && songsInfo.length !== 0){
							// _this.$searchFinalResult.hide();
					 		_this.$searchHintList.empty();
							var songs = [];
							for(var i=0;i<songsInfo.length;i++){
								songs.push(songsInfo[i].attributes);
								songs[i].id = songsInfo[i].id;
							}
							songs.forEach(function(song){
								var html = '<li class="listItem">'+song.name+'<i class="magnifier"><i><li>';
								_this.$searchHintList.append(html).show();
							});
						}
						//按下enter,找到结果时
						if(e.which === 13 && songsInfo.length !== 0){
							_this.$searchInput.blur();		
							_this.$searchHint.hide();
							_this.$searchHintList.hide();
							_this.$historyRecord.hide();
							_this.$hotSearch.hide();

							var songs = [];
							for(var i=0;i<songsInfo.length;i++){
								songs.push(songsInfo[i].attributes);
								songs[i].id = songsInfo[i].id;
							}
							songs.forEach(function(song){
						 		var html = '<li>'
												+'<a href="./song.html?id='+song.id +'">'
													+'<h3>'+song.name+'</h3>'
													+'<p>'
														+'<i>'
															+'<svg class="icon-sq" aria-hidden="true">'
															    +'<use xlink:href="#icon-sq""></use>'
															+'</svg>'
														+'</i>'
														+song.singer+' - ' + song.name
													+'</p>'
													+'<svg class="icon-play-circled" aria-hidden="true">'
													+'<use xlink:href="#icon-play-circled-copy"></use>'
													+'</svg>'
												+'</a>'
											+'</li>';
								_this.$searchFinalResult.append(html).show();
							});
						}
					})					
				}
			},400);	 
		});	

		this.$searchInput.focus(function(){
			$(this).trigger('input');
			$(this).trigger('keyup');
			_this.$searchFinalResult.empty().hide();
		})

		this.$clearBtn.on('click',function(){
			  _this.$searchInput.val('').focus();
			  $(this).hide();
			  _this.$searchHint.hide();
			  _this.$searchHintList.hide();
			  _this.$historyRecord.show();
			  _this.$hotSearch.show();
			  _this.$searchFinalResult.empty();
			  _this.$noResult.hide();	
		})

		//点击搜索提示列表.searchHintList(点击enter之前)
		this.$searchHintList.on('click','li',function(){
				_this.$historyRecord.hide();
				var value = $(this).text();
				var queryName = new AV.Query('Song');
				queryName.contains('name',value);	
				queryName.find().then(function(songInfo){
					if(songInfo.length === 0){
						_this.$searchHintList.empty();
						var $li = $('<li>没有结果<li>');
						$li.addClass('searchHintList-item');
						_this.$searchHintList.append($li);
						return false;
					}

			 		_this.$searchHint.hide();
			 		_this.$searchHintList.empty().hide();
					var song=songInfo[0].attributes;
						song.id = songInfo[0].id;

					var html = '<li>'
								    +'<a href="./song.html?id='+song.id +'">'
										+'<h3>'+song.name+'</h3>'
										+'<p>'
											+'<i>'
												+'<svg class="icon-sq" aria-hidden="true">'
												    +'<use xlink:href="#icon-sq""></use>'
												+'</svg>'
											+'</i>'
											+song.singer+' - ' + song.name
										+'</p>'
										+'<svg class="icon-play-circled" aria-hidden="true">'
										+'<use xlink:href="#icon-play-circled-copy"></use>'
										+'</svg>'
									+'</a>'
								+'</li>';
			 		_this.$searchFinalResult.empty().append(html).show();
				})			
			})			
		}	

	new RenderIndexPage($('.page'));


//随机生成热门歌曲
// function getRandom(){
// 	var arr = [];
//     for(var i=0;i<10;i++){  
//       arr.push(parseInt(Math.random()*14));
//     }
// 	arr =  arr.filter(function(ele){
// 		return arr.indexOf(ele) === arr.lastIndexOf(ele);
// 	});
// 	return arr;
// }

		

// 	//点击enter后的最终搜索记录.searchFinalResult
// 	$('.searchFinalResult').on('click','li',function(){
// 		$searchInput.val('');
// 	})




// })

// 	// getLocalStorage.js
// 	// new GetLocalStorage($('body'));
// 	// 点击历史记录.hostoryRecord列表
	
// 	$('.historyRecord').on('click','li',function(){
// 		$('.hotSearch').hide();
//  		$('.historyRecord').hide();				
// 		$('input').val($(this).text());
// 		$('.clear').show();
// 		var value = $('input').val();

// 		$('.searchMusic .loading').show();
// 		var queryName = new AV.Query('Song');
// 		queryName.contains('name',value);	 
// 		var querySinger = new AV.Query('Song');
// 		querySinger.contains('singer',value);
// 		var query = AV.Query.or(queryName,querySinger);
// 		query.find().then(function(songInfo){
// 			$('.searchMusic .loading').hide();

// 			if(songInfo.length === 0){
// 				$('.hotSearch').hide();
// 				$('.no-result').show();
// 				return false;
// 			}else{
// 				var song=songInfo[0].attributes;
// 				song.id = songInfo[0].id;

// 		 		var html = `<li>
// 								<a href="./song.html?id=${song.id}">
// 								<h3>${song.name}</h3>
// 								<p>
// 									<i>
// 										<svg class="icon-sq" aria-hidden="true">
// 										    <use xlink:href="#icon-sq""></use>
// 										</svg>
// 									</i>
// 									${song.singer} - ${song.name}
// 								</p>
// 								<svg class="icon-play-circled" aria-hidden="true">
// 								    <use xlink:href="#icon-play-circled-copy"></use>
// 								</svg>
// 								</a>
// 							</li>`;
// 		 		// $searchFinalResult.empty().append(html);
// 		 		$searchFinalResult.empty().append(html).show();
// 			}		
// 		})

// 		if($('input').val().trim() === ''){
// 			$('.historyRecord').show();	
// 		}
// 	});




// 	//点击 热门搜索
	
// 	$('.hotSearch').on('click','li',function(){
// 		$('.hotSearch').hide();
// 		$('.historyRecord').hide();
// 		$('input').val($(this).text());
// 		$('.clear').show();
// 		var value = $('input').val();
// 		$('.searchMusic .loading').show();
// 			console.log('songsData:',songsData);
// 		var queryName = new AV.Query('Song');
// 		queryName.contains('name',value);	 
// 		var querySinger = new AV.Query('Song');
// 		querySinger.contains('singer',value);
// 		var query = AV.Query.or(queryName,querySinger);
// 		query.find().then(function(songsInfo){

// 		$('.searchMusic .loading').hide();
// 		//热门搜索里的歌曲肯定能搜到，所以这里的if不写也可以
// 			if(songsInfo.length === 0){
// 				$('.hotSearch').hide();
// 				$('.no-result').show();
// 				// return false;
// 			}else{		
// 				var song=songsInfo[0].attributes;
// 				song.id = songsInfo[0].id;
// 				console.log(song);
// 		 		var html = `<li>
// 								<a href="./song.html?id=${song.id}">
// 								<h3>${song.name}</h3>
// 								<p>
// 									<i>
// 										<svg class="icon-sq" aria-hidden="true">
// 										    <use xlink:href="#icon-sq""></use>
// 										</svg>
// 									</i>
// 									<span>${song.singer} - ${song.name}</span>
// 								</p>
// 								<svg class="icon-play-circled" aria-hidden="true">
// 								    <use xlink:href="#icon-play-circled-copy"></use>
// 								</svg>
// 								</a>
// 							</li>`;
// 		 		$searchFinalResult.empty().prepend(html).show();
// 			}		
// 		})

// 		if($('input').val().trim() === ''){
// 			$('.historyRecord').show();	
// 		}
// 	})

