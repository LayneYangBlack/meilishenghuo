/**
 * Created by liyongbiao on 11/4/15.
 */


/***
 * uploadFileObj 上传对象
 * name:名字（上传页面上显示的名字）
 * id:区分该文件的唯一ID（可以用原始的路径来表示）
 * path:文件的路径
 * thumbUrl:缩略图路径
 * uploadUrl:上传的服务器路径
 * needToDelete:需要删除的文件。由于图片取出来修正后是临时路径重启后会丢失，所以需要先拷贝到本地路径
 * compress:压缩的类型 -1为不压缩
 * size:大小
 * status:上传的状态
 * retryTime:上传重试的次数
 * functionName:方法名字（此方法必须在首页上，作为上传的最后一步）
 * params:方法的参数（参数，注意不要使用多重json。即json的属性是格式化的json字符串）
 */


/**
 * 事件类型：
 * 所有事件 all
 * 添加删除事件 addOrDelete
 * 更改状态事件 updateStatus
 * 上传进度事件 progress
 *
 *
 */

var upload_allUploadFileKey="uploadFileObj_allUploadFile";
var upload_uploadLock="unLock";

function upload_getStatusName (status) {
    if (status == 0) {
        return '准备上传';
    } else if (status == 1) {
        return '上传中';
    } else if (status == 2) {
        return '停止上传';
    } else if (status == 3) {
        return '上传完成';
    } else if (status == 4) {
        return '停止上传';
    } else if (status == 5) {
        return '上传失败';
    }
    return '';
}




function upload_getAllUploadFile(callBack){
    getItem(upload_allUploadFileKey,function(ret,err){
        var result=[];
        if(ret.status){
            var dbValue=ret.data;
            if(isNotBlack(dbValue)){
                result=JSON.parse(dbValue);
            }
            callBack({status:true,data:result},err);
        }else{
            if(callBack){
                callBack(ret,err);
            }
        }
    });

}

function upload_addUploadFile(uploadFileObjs) {
    api.sendEvent({
        name: 'ue_upload_addUploadFile',
        extra: {
            uploadFileObjs: uploadFileObjs
        }
    });
}

/**
 * 添加上传文件
 */
function _upload_addUploadFile(eventMsg){
    //alert("upload_addUploadFile:"+$api.getStorage("upload_uploadLock"));
    if(upload_uploadLock!="lockIng") {
        upload_uploadLock="lockIng";
        var uploadFileObjs=eventMsg.uploadFileObjs;
        upload_getAllUploadFile(function(ret,err){
            if(ret.status){
                var result=ret.data;
                for(var j=0;j<uploadFileObjs.length;j++){
                    var hasThis=false;
                    var uploadFileObj=uploadFileObjs[j];
                    for(var i=0;i<result.length;i++){
                        if(result[i].id==uploadFileObj.id){
                            hasThis=true;
                            if(result[i].status==2||result[i].status==4||result[i].status==5){
                                result[i].status=0;
                            }
                            break;
                        }
                    }
                    if(!hasThis){
                        uploadFileObj.status=0;
                        result.push(uploadFileObj);
                    }
                }

                setItem(upload_allUploadFileKey,JSON.stringify(result),function(ret,err){
                    upload_uploadLock='unLock';
                    _uploadEventCallBack("addOrDelete",{});
                    upload_startUploadModel();
                });
            }else{
                upload_uploadLock='unLock';
            }
        });

    }else{
        setTimeout(function(){
            //toast("调试日志：upload_addUploadFile lock");
            _upload_addUploadFile(eventMsg);
        },50);
    }
}



//启动上传模块 开启上传模式
function upload_startUploadModel(){
    api.execScript({
        name:rootWindowName,
        script: '_startUploadModel()'
    });
}

function upload_startUploadFile(id){
    api.execScript({
        name:rootWindowName,
        script: '_startUploadFile("'+id+'")'
    });
}



function upload_deleteUploadFile(id){
    api.execScript({
        name:rootWindowName,
        script: '_deleteUploadFile("'+id+'")'
    });
}



function _startUploadFile(id){
    _changeUploadFileStatus({id:id},0,function(ret,err){
        upload_startUploadModel();
    });
}
/**
 * 删除一个上传文件
 */
function _deleteUploadFile(id,callBack){
    //alert("_deleteUploadFile:"+$api.getStorage("upload_uploadLock"));
    if(upload_uploadLock!="lockIng") {
        upload_uploadLock="lockIng";
        upload_getAllUploadFile(function(ret,err){
            if(ret.status){
                var uploadFileObj;
                var result=ret.data;
                for(var i=0;i<result.length;i++){
                    if(result[i].id==id){
                        uploadFileObj=result[i];
                        result.splice(i, 1);
                        break;
                    }
                }
                if(uploadFileObj){
                    setItem(upload_allUploadFileKey,JSON.stringify(result),function(ret,err){
                        upload_uploadLock='unLock';
                        _deleteUploadTaskAndFIle(uploadFileObj);
                        _uploadEventCallBack("addOrDelete",{});
                        if(callBack){callBack();}
                    });
                }else{
                    upload_uploadLock='unLock';
                    if(callBack){callBack();}
                }
            }else{
                upload_uploadLock='unLock';
                if(callBack){callBack();}
            }
        });
    }else{
        setTimeout(function(){
            //toast("调试日志：_deleteUploadFile lock");
            _deleteUploadFile(id);
        },50);
    }
}

function _deleteUploadTaskAndFIle(uploadFileObj){

    //删除上传文件
    if(uploadFileObj.uploadUrl){
        var fs = api.require('fs');
        fs.remove({
            path: uploadFileObj.uploadUrl
        },function(ret,err){
        });
    }
}




//系统启动自动暂停所有上传项目
function initUpload(){

    api.addEventListener({
        name: 'ue_upload_addUploadFile'
    }, function( ret, err ){
        _upload_addUploadFile(ret.value);
    });

    getItem(upload_allUploadFileKey,function(ret,err){
        var result=[];
        if(ret.status){
            var dbValue=ret.data;
            if(isNotBlack(dbValue)){
                result=JSON.parse(dbValue);
                var changed=false;
                for(var j=0;j<result.length;j++){
                    if(result[j].status==constant_upload_status_uploading||result[j].status==constant_upload_status_ready){
                        result[j].status=constant_upload_status_pause;
                        changed=true;
                    }
                }
                if(changed){
                    setItem(upload_allUploadFileKey , JSON.stringify(result), function (ret, err) {
                    });
                }

            }
        }
    });
}

/**
 * 更改上传文件的状态
 */
function _changeUploadFileStatus(uploadFileObj,status,callBack){
    //alert("_changeUploadFileStatus:"+$api.getStorage("upload_uploadLock"));
    if(upload_uploadLock!="lockIng") {
        upload_uploadLock="lockIng";
        upload_getAllUploadFile(function(ret,err){
            if(ret.status){
                var result=ret.data;
                var orgStatus;
                for(var i=0;i<result.length;i++){
                    if(result[i].id==uploadFileObj.id){
                        orgStatus=result[i].status;
                        result[i].status=status;
                        uploadFileObj=result[i];
                        break;
                    }
                }
                setItem(upload_allUploadFileKey,JSON.stringify(result),function(ret,err){
                    upload_uploadLock='unLock';
                    _uploadEventCallBack("updateStatus",{id:uploadFileObj.id,status:status});
                    if(callBack){
                        ret.orgStatus=orgStatus;//原始状态
                        callBack(ret,err);
                    }
                });
            }else{
                upload_uploadLock='unLock';
                if(callBack){
                    callBack(ret,err);
                }
            }
        });

    }else{
        setTimeout(function(){
            //toast("调试日志：_changeUploadFileStatus lock");
            _changeUploadFileStatus(uploadFileObj,status,callBack);
        },50);
    }
}


var upload_locking=false;//是否正在上传中
function _startUploadModel(){
    //alert("_startUploadModel,upload_locking:"+upload_locking);
    //如果正在上传或者没有新的可上传的数据,或者也没有wifi，那么直接返回。
    if(upload_locking){
        return;
    }
    upload_locking=true;

    upload_getAllUploadFile(function(ret,err){
        //alert(JSON.stringify(ret));
        if(ret.status){
            var result=ret.data;
            var uploadFileObj;
            for(var i=0;i<result.length;i++){
                var tmp=result[i];
                if(tmp.status==0){
                    uploadFileObj=tmp;
                    break;
                }
            }
            //没有更多可以上传的数据了
            if(isBlack(uploadFileObj)){
                upload_locking=false;
                return;
            }

            _changeUploadFileStatus(uploadFileObj,constant_upload_status_uploading);

            if(uploadFileObj.compress>=0){
                compressImage(uploadFileObj.size,uploadFileObj.compress,uploadFileObj.path,function(ret){
                    var compressPath=ret.path;
                    //alert("compressPath"+compressPath+",uploadFileObj.path"+uploadFileObj.path);
                    api.ajax({
                        tag:uploadFileObj.uploadUrl,
                        url:uploadFileObj.uploadUrl ,
                        method: 'post',
                        timeout: 120,
                        report:true,
                        dataType: 'json',
                        returnAll: false,
                        data: {
                            files: {file: compressPath}
                        }
                    }, function (ret, err) {
                        if(ret&&ret.status==0){
                            //alert("upload progress");
                            _uploadEventCallBack("progress",{id:uploadFileObj.id,value:ret.progress});
                        } else if(ret&&ret.status==1){
                            //alert("upload end");
                            _uploadEventCallBack("progress",{id:uploadFileObj.id,value:100});
                            _uploadImgToAlbum(ret.body.ok,uploadFileObj);
                            apiCloud_removeFile(compressPath);
                        }else{
                            //alert("upload error");
                            _errorOnUploadFile(uploadFileObj);
                            apiCloud_removeFile(compressPath);
                        }
                    });
                });
            }else{
                api.ajax({
                    tag:uploadFileObj.uploadUrl,
                    url: uploadFileObj.uploadUrl,
                    method: 'post',
                    timeout: 120,
                    report:true,
                    dataType: 'json',
                    returnAll: false,
                    data: {
                        files: {file: uploadFileObj.path}
                    }
                }, function (ret, err) {
                    if(ret&&ret.status==0){
                        _uploadEventCallBack("progress",{id:uploadFileObj.id,value:ret.progress});
                    } else if(ret&&ret.status==1){
                        _uploadEventCallBack("progress",{id:uploadFileObj.id,value:100});
                        _uploadImgToAlbum(ret.body.ok,uploadFileObj);
                    }else{
                        _errorOnUploadFile(uploadFileObj);
                    }
                });
            }
        }else{
            upload_locking=false;
        }
    });
}



function _uploadImgToAlbum(address,uploadFileObj){
    var getData=uploadFileObj.params;
    getData.url=address;
    ajaxGet(album_createPhotoUrl,getData,function(ret,err){
        if(ret){
            //alert("success");
            _successOnUploadFile(uploadFileObj);
        }else{
            //alert("fail");
            _errorOnUploadFile(uploadFileObj);
        }
    });
}

//失败了调用一下
function _errorOnUploadFile(uploadFileObj){
    _changeUploadFileStatus(uploadFileObj,5,function(ret){
        upload_locking=false;
        _startUploadModel();
    });
}

function _successOnUploadFile(uploadFileObj){
    _deleteUploadFile(uploadFileObj.id,function(ret){
        upload_locking=false;
        _startUploadModel();
    });
}

function _uploadEventCallBack(eventType,extra){
    api.sendEvent({
        name: 'upload_'+eventType,
        extra:extra
    });
}