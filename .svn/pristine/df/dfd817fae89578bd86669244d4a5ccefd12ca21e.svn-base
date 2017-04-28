
var guideDir = 'fs://guide';
var fsVideoPath = guideDir + '/guide.mp4';
var widgetVideoPath = 'widget://image/guide.mp4';

function playGuide(callback){
	var fs = api.require('fs');
	
	fs.exist({
	    path: guideDir
	},function(ret,err){
	    if(ret.exist){
	        fs.exist({
			    path: fsVideoPath
			},function(ret,err){
	        		if(ret.exist){
	        			_playGuide(callback);
	        		} else {
	        			_copyPlay(callback);
	        		}
	     	});
	    } else {
	        fs.createDir({
				path : guideDir
			},function(ret,err){
				if (ret.status) {
					_copyPlay(callback);
				}
			});
	    }
	});
}

function _copyPlay(callback){
	var fs = api.require('fs');
	fs.copyTo({
		oldPath: widgetVideoPath,
		newPath: guideDir
	},function(ret,err){
		if(ret.status){
			_playGuide(callback);
		}
	});
}

function _playGuide(callback){
	$api.setStorage(isShowGuide, true);
	$api.setStorage(lastTime, 0);
	var videoPlayer = api.require('videoPlayer');
	videoPlayer.open({
		path : fsVideoPath,
		rect : {
			x: 0,
			y: 0,
			w: api.winWidth,
			h: api.winHeight
		},
//		fixedOn : api.frameName
		fixed : true
	},function(ret, err){
		
	});
	
//	videoPlayer.fullScreen();
//	api.setScreenOrientation({
//		orientation : 'portrait_up'
//	});

	videoPlayer.addEventListener({
		name : 'play'
	},function(ret, err){
		if(ret.eventType == 'complete'){
			videoPlayer.removeEventListener({
			    name: 'play'
			});
			videoPlayer.close();
			if(callback){
				callback();
			}
		}
	});
}
