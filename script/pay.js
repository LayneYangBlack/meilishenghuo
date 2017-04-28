
function pay(payType,params,url,pidUrl,callback){
	if(payType == 'alipay'){
		aliPay(params,url,pidUrl,callback);
	} else if (payType == 'weixin') {
		weixinPay(params,callback);
	}
}


function weixinPay(params,callback){
	api.showProgress({});
	ajaxGet(payWxpayParamUrl,params,function(ret,err){
		if(ret && ret.success == true){
			var wxPay = api.require('wxPay');
//			alert(JSON.stringify(ret.data));
			
			var wxOrderId = ret.data.prepayid;
			var mchId = ret.data.partnerid;
			var nonce_str = ret.data.noncestr;
			var sign = ret.data.sign;
			var timeStamp = ret.data.timestamp;
			var wxPackage = ret.data.package;
			
			wxPay.payOrder({
				orderId: wxOrderId,
				mchId: mchId,
				nonceStr: nonce_str,
				timeStamp: timeStamp,
				package : wxPackage,
				sign: sign
			}, function(ret, err){
//				alert(JSON.stringify(ret));
//				alert(JSON.stringify(err));
				api.hideProgress();
				if(ret.status == true){
					//支付成功
					api.toast({
				    		msg : '支付成功！'
			        });
					callback(ret);
				}else{
					api.toast({
				    		msg : '支付失败！请稍候再试！'
			        });
				}
			});
			
		} else {
			api.hideProgress();
			api.toast({
	        		msg : ret.errorMessage
            });
		}
	});
	
}


function aliPay(params,url,pidUrl,callback){
	api.showProgress({});
	ajaxGet(url,params,function(ret,err){
		api.hideProgress();
		if(ret && ret.success == true){

			var obj = api.require('aliPay');
			var orderInfo = ret.payParam;
			obj.payOrder({
				orderInfo : orderInfo
			},function(ret,err) {
				if(ret.code == 9000){
					ajaxGetWithProgress(pidUrl,payParams,function(ret){
						if(isNotBlack(ret)&&ret.success){
							callback(ret);
						}else{
							toast("支付失败！")
						}
					});
				}else{
					api.toast({
	                		msg : '支付失败！请稍候再试！'
                    });
				}
			});
		} else {
			api.toast({
	        		msg : ret.errorMessage
            });
		}
	});
}