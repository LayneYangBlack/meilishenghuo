
(function(window){
	
	var isStop = true;
	var _x = 0;
	var _y = 0;
	
	window.onscroll = function () {
		isStop = true;
	};
	
	function screen(){
		isStop = false;
		while(!isStop){
			var screenTop = document.documentElement.scrollTop || document.body.scrollTop;  
	    		$api.byId('test').innerText = screenTop;
			var imgs = document.getElementsByTagName('img');
			for(var i = 0;i < imgs.length;i++){
				var img = imgs[i];
				var sourceSrc = img.getAttribute('sourceSrc');
				var imgTop = img.getBoundingClientRect().top;
				
				if(img && sourceSrc && (imgTop - screenTop) < api.winHeight){
					img.src = sourceSrc;
				}
			}
		}
	}
	
	function touchStartFunc(evt) {
	    try{  
	        //evt.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等  
	  
	        var touch = evt.touches[0]; //获取第一个触点  
	         _x = Number(touch.pageX); //页面触点X坐标  
	         _y = Number(touch.pageY); //页面触点Y坐标
	         	
	    } catch (e) {
	    	
	    }
	}
	
	function touchMoveFunc(evt) {  
	    try {
	        //evt.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等  
	        var touch = evt.touches[0]; //获取第一个触点  
	        var x = Number(touch.pageX); //页面触点X坐标  
	        var y = Number(touch.pageY); //页面触点Y坐标 
	        
	        $api.byId('test1').innerText = x + '_' + y;
	        
//	        if(!isStop){
//	        		return;
//	        }
//	        
//	        isStop = false;
	        
//	        while(true){
//	        		if(isStop){
//	        			$api.byId('test2').innerText = '5555'
//	        			break;
//	        		}
//	        }
	        
//	        if (y - _y != 0) {  
//          		if(isStop){
//          			isStop = false;
//          			
//          			var id = setInterval(function(){
//          				screen();
//          				if(isStop){
//          					clearInterval(id);
//          				}
//          			},50);
//          			
//          		}
//          }
			
	    } catch (e) {
	    }  
	}
	
	function touchEndFunc(evt) {  
	    try {  
	        //evt.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等
	        
	        if(isStop == true){
            		isStop = false;
            		screen();
//          		var id = setInterval(function(){
//          			screen();
//          			$api.byId('test2').innerText = new Date().getTime();
//          			if(isStop){
//          				clearInterval(id);
//          			}
//          		},100);
            			
            	}
			
			

//			while(true){
//				$api.byId('test2').innerText = new Date().getTime();
//				
//				var now = new Date();
//			    var exitTime = now.getTime() + 1000;
//			    while(true){
//			        now = new Date();
//			        if(now.getTime() > exitTime)
//			        		continue;
//			    }
//			}
	    } catch (e) {
	    }
	}
	
	function bindEvent() {  
	    document.addEventListener('touchstart', touchStartFunc, false);  
	    document.addEventListener('touchmove', touchMoveFunc, false);  
	    document.addEventListener('touchend', touchEndFunc, false);  
	}
	
	//判断是否支持触摸事件  
	function isTouchDevice() {  
	    try {  
	        document.createEvent("TouchEvent");  
	        bindEvent(); //绑定事件  
	    }  
	    catch (e) {
	    }  
	}
	
	isTouchDevice();
	
})(window);


//(function(window){
//	window.onscroll = function () {  
//		var screenTop = document.documentElement.scrollTop || document.body.scrollTop;  
//  		$api.byId('test').innerText = screenTop;
//  		screen(screenTop);
//	};
//	
//	function screen(screenTop){
//		var imgs = document.getElementsByTagName('img');
//		var text = "";
//		for(var i = 0;i < imgs.length;i++){
//			var img = imgs[i];
//			var sourceSrc = img.getAttribute('sourceSrc');
//			var imgTop = img.getBoundingClientRect().top;
//			
//			if(img && sourceSrc && (imgTop - screenTop) < api.winHeight){
//				text += img.id + ",";
//				img.src = sourceSrc;
//			}
//		}
//		
//		$api.byId('test1').innerText = text;
//	}
//	
//})(window);
