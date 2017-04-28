
function playvideoBySystemType(title,url){
	if(api.systemType == 'ios'){
		_checkWifi(title,url,_playByVideoplay);
	} else {
		_checkWifi(title,url,_playByQCloudPlay);
	}
}

function playvideo(title,url,addEv){

	_checkWifi(title,url,addEv,_playByVideoplay);
}

function _checkWifi(title,url,addEv,callback){
	var connectionType = api.connectionType;
	if(connectionType == 'wifi'){
		callback(title,url,addEv);
	} else {
		api.confirm({
		    title: '',
		    msg: '当前不在wifi网络下，是否继续播放?',
		    buttons: ['确定', '取消']
		},function( ret, err ){
		    if(ret && ret.buttonIndex == 1){
		    		callback(title,url,addEv);
		    }
		});
	}
}

function _playByQCloudPlay(title,m3u8Url){
	var qCloudVODPlayer = api.require('qCloudVODPlayer');

	var param = {
		x : 30,
		y : 50,
		w : 300,
		h : 180,
		videoUrl :m3u8Url
	};

	qCloudVODPlayer.playInCurWin(param);
}

function _playByVideoplay(title,url,addEv){
	var videoPlayer = api.require('videoPlayer');
	videoPlayer.play({
    		texts: {
			head: {
            		title: title
        		}
		},
		styles : {
			head : {
				//height : 44,
				//backSize : 40,
				//backImg : 'widget://icon/videoplay/back.png',
				//setSize : 44,
				//setImg : 'widget://icon/videoplay/more.png',
			},
			foot : {
				//playSize : 30,
				//playImg : 'widget://icon/videoplay/play.png',
				//nextSize : 30,
				//nextImg : 'widget://icon/videoplay/next.png',
				//pauseImg : 'widget://icon/videoplay/pause.png',
			}
		},
		path: url,
		autoPlay:true,
		autorotation:true
	},function(ret, err) {
		if(ret.eventType == "play"){
			if(addEv){
				addEv();
			}
		}

	});
	//api.showProgress({title: '努力加载中...',text: '先喝杯茶...'});
	//videoPlayer.open({
	//	path: url,
	//	rect : {
	//		x: 0,
	//		y: 0,
	//		w: api.winWidth,
	//		h: api.winHeight
	//	},
	//	fixedOn : api.frameName,
	//	fixed : true
	//}, function(ret, err){
	//	if( ret.status){
	//		api.hideProgress();
	//	}
	//});

	videoPlayer.addEventListener({
		name : 'play'
	},function(ret, err){
		if(ret.eventType == 'complete'){
			videoPlayer.removeEventListener({
				name: 'play'
			});
			videoPlayer.close();
			if(addEv){
				addEv();
			}
		}
	});

}


function _play(){
	var tencentPlayer = api.require('tencentPlayer');
	tencentPlayer.open({
			rect : {
				x : 0,
				y : 0,
				w : 400,
				h : 300
			},
			fixedOn : api.frameName,
			fixed : true
		},
		function(ret, err){
			if( ret.status ){
				alert( JSON.stringify( ret ) );
			}else{
				alert( JSON.stringify( err ) );
			}
		});
	tencentPlayer.play({
		path: 'http://7o50kb.com2.z0.glb.qiniucdn.com/c1.1.mp4'
	});
}