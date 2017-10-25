
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
	$('.page').show();
	var RenderIndexPage = function($ct){
		this.$ct = $ct;
		this.init();
		// this.bindEvent();
		this.getPlayLists();
		this.getSongsData();
		this.bindEvent();
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
	}

	RenderIndexPage.prototype.getPlayLists = function(){
		var _this = this;

		//连接到LeanCloud
		var APP_ID = 'DBDdgDjhDUF86XBUsX2Ql15X-gzGzoHsz';
		var APP_KEY = 'tAQUlyLMWrsge4kJQRP4WlV7';

		AV.init({
		  appId: APP_ID,
		  appKey: APP_KEY
		});				

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
	    	var html = `<span class="visits">${list.view}</span>
	    				<img src="${list.picture}" alt="">`;
	    	var para = `<p>${list.description}</p>`;

		    _this.$listImgCt.eq(index).append(html);	
		    _this.$listLink.eq(index).append(para);
		    _this.$listLink.eq(index).attr('href',`./playlist.html?id=${list.id}`);		
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
			console.log(songs)
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
		  	var html = `<li>
		  					<span data-ranking="${ranking}"></span>
							<a href="./song.html?id=${song.id}">
							<h3>${song.name}</h3>
							<p><i>
									<svg class="icon-sq" aria-hidden="true">
									    <use xlink:href="#icon-sq""></use>
									</svg>
								</i>
								<span>${song.singer} - ${song.name}</span>
							</p>
							<svg class="icon-play-circled" aria-hidden="true">
							    <use xlink:href="#icon-play-circled-copy"></use>
							</svg>
							</a>
						</li>`;

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
				// _this.$searchFinalResult.hide();
				 _this.$searchHint.show().find('span').text('"'+value+'"');

			 	// if(!value){
			 	// 	$searchHint.hide();
			 	// 	$searchHintList.empty();
			 	// 	$hotSearch.show();
			 	// 	// hotTimer=setInterval(function(){
					// 	// 		renderHotMusic(songsData);
					// 	// 	},5000);
			 	// }else{
				 // 	$searchHint.show().find('span').text('"'+value+'"')
			 	// }	
			 	// $this.trigger('keyup');					
			} 
		});

		var timer = null;
		this.$searchInput.keyup(function(e){
			var _this = this;


			if(timer){
				clearTimeout(timer);
			}


//截止日期：10-25
			timer = setTimeout(function(){
			 	var value =$(this).val();

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
						if(e.which ==13 && songsInfo.length === 0){
							$('.no-result').show();
							_this.$searchHint.hide();
							_this.$searchHintList.hide();
						}
						//无论是否按下enter，都没有找到结果时
						if(songsInfo.length === 0){
							_this.$searchHintList.empty();
							_this.$searchHintList.append('<li class="listItem">没有结果</li>');
							return false;
						}
						//没按下enter
						if(e.which !== 13){
					 		_this.$searchHintList.empty();
							var songs = [];
							for(var i=0;i<songsInfo.length;i++){
								songs.push(songsInfo[i].attributes);
								songs[i].id = songsInfo[i].id;
							}
							songs.forEach(function(song){
								var html = `<li class="listItem">${song.name}<li>`;
								_this.$searchHintList.append(html);
							});
						}
						//按下enter,找到结果时
						if(e.which == 13 && songsInfo.length !==0){

							_this.$searchHint.hide();
							_this.$searchHintList.hide();

					 		var html = `<li>
											<a href="./song.html?id=${song.id}">
												<h3>${song.name}</h3>
												<p>
													<i>
														<svg class="icon-sq" aria-hidden="true">
														    <use xlink:href="#icon-sq""></use>
														</svg>
													</i>
													${song.singer} - ${song.name}
												</p>
												<svg class="icon-play-circled" aria-hidden="true">
												    <use xlink:href="#icon-play-circled-copy"></use>
												</svg>
											</a>
										</li>`;

							_this.$searchFinalResult.append(html);
						}
					})					
				}
			},400);	 				
		});
	}

	new RenderIndexPage($('.page'));


//随机生成热门歌曲
function getRandom(){
	var arr = [];
    for(var i=0;i<10;i++){  
      arr.push(parseInt(Math.random()*14));
    }
	arr =  arr.filter(function(ele){
		return arr.indexOf(ele) === arr.lastIndexOf(ele);
	});
	return arr;
}




	// input输入框输入内容，并按下了enter键
// 	$('.search').keyup(function(e){

// 		if(timer){
// 			clearTimeout(timer);
// 		}

// 		timer = setTimeout(function(){

// 		 	var value =$('search').val().trim();
// 		 	if(!value){
// 		 		return false;
// 		 	}else{

// 			 	$searchHint.show().css('font-size','15px').find('span').text('"'+value+'"');

// 				var queryName = new AV.Query('Song');
// 				queryName.contains('name',value);	 
// 				var querySinger = new AV.Query('Song');
// 				querySinger.contains('singer',value);
// 				var query = AV.Query.or(queryName,querySinger);
// 				query.find().then(function(songsInfo){
// 					if(e.which ==13 && songsInfo.length === 0){
// 						$('.no-result').show();
// 						$('.searchHint').hide();
// 						$('.searchHintList').hide();
// 					}
// 					if(songsInfo.length === 0){
// 						$searchHintList.empty();
// 						$searchHintList.append('<li class="listItem">没有结果</li>');
// 						return false;
// 					}else{
// 				 		$searchHintList.empty();
// 						var songs = [];
// 						for(var i=0;i<songsInfo.length;i++){
// 							songs.push(songsInfo[i].attributes);
// 							songs[i].id = songsInfo[i].id;
// 						}
// 						songs.forEach(function(song){
// 							var html = `<li class="listItem">${song.name}<li>`;
// 							$searchHintList.append(html);
// 								// enter
// 							 	if(e.which == 13){

// 							 		$searchHint.hide();
// 							 		$searchHintList.hide();

// 							 		var html = `<li>
// 													<a href="./song.html?id=${song.id}">
// 													<h3>${song.name}</h3>
// 													<p>
// 														<i>
// 															<svg class="icon-sq" aria-hidden="true">
// 															    <use xlink:href="#icon-sq""></use>
// 															</svg>
// 														</i>
// 														${song.singer} - ${song.name}
// 													</p>
// 													<svg class="icon-play-circled" aria-hidden="true">
// 													    <use xlink:href="#icon-play-circled-copy"></use>
// 													</svg>
// 													</a>
// 												</li>`;
// 							 		$searchFinalResult.append(html);
// 							 	}
// 						})					
// 					}

// 				});	 		
// 		 	}	
// 		},400);	 
// });


// 	// 点击搜索提示列表.searchHintList(点击enter之前)
// 	$('.searchHintList').on('click','li',function(){
// 			$('.historyRecord').hide();
// 			var value = $(this).text();
// 			var queryName = new AV.Query('Song');
// 			queryName.contains('name',value);	
// 			queryName.find().then(function(songInfo){
// 				if(songInfo.length === 0){
// 					$searchHintList.empty();
// 					$searchHintList.append('<li style="width:90%;margin:0 auto;padding:5px 0 5px 10px;border-top:1px solid #ccc;border-bottom:1px solid #ccc;">没有结果</li>');
// 					return false;
// 				}
// 		 		$searchHintList.empty();
// 				var song=songInfo[0].attributes;
// 					song.id = songInfo[0].id;

// 				var html = `<li style="width:90%;margin:0 auto;padding:5px 0 5px 10px;border-top:1px solid #ccc;border-bottom:1px solid #ccc;">${song.name}<li>`;
// 				$searchHintList.append(html);


// 		 		$searchHint.hide();
// 		 		$searchHintList.hide();
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
// 		 		$searchFinalResult.empty().append(html);


// 			})			
// 	})		

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










// 	//点×清空输入框内容
// 	$('.search').on('input',function(){
// 		if($(this).val().trim()===''){
// 		  $('.clear').hide();
// 		  $('.historyRecord').show();
// 		  $('.hotSearch').show();
// 		}else{
// 		  $('.historyRecord').hide();
// 		  $('.clear').show();
// 		  $('.searchHintList').show();
// 		  $('.hotSearch').hide();
// 		} 
// 		})

// 	$('.clear').on('click',function(){
// 		  $('.search').val('');
// 		  $('.search').focus();
// 		  $(this).hide();
// 		  $('.searchHint').hide();
// 		  $('.searchHintList').hide();
// 		  $('.historyRecord').show();
// 		  $('.hotSearch').show();
// 		  $('.searchFinalResult').empty();
// 		  $('.no-result').hide();
// 	})


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

