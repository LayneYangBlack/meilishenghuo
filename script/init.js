//======================系统初始化（开始）=============================
function systemInit(callBack){
    initDb(function (ret, err) {
        if (ret.status) {
            initFs(function (ret) {
                if (ret.status || ret.exist) {
                    //判断是否第一次打开
                    initShowGuide(function(){
                        //初始化用户
                        initUser(function(){
                            //初始化系统信息
                            initSystemInfo(function(){
                                initOther(function(){
                                    initUserPage(function(isOpen){
                                        if(isOpen != 2){
                                            openTab('home');
                                        }else{
                                            openNewWindow('mallDetail','./html/mall/mallDetail.html',{},{slidBackEnabled:false})
                                        }
                                        if(callBack){
                                            callBack();
                                        }
                                    });
                                });


                            });
                        });
                    });
                } else {
                    api.alert({msg: "无法建立本地文件夹"});
                }
            });
        } else {
            api.alert({msg: "数据库加载错误:" + JSON.stringify(err)});
        }
    });
}

var callbackMethod;
function initShowGuide(callback){
    //判断是否第一次打开
    var showGuide = $api.getStorage(isShowGuide);
    if (!showGuide || isTest) {
        callbackMethod = callback;
        openFrame('guide','./html/guide/guide.html',{},0,0);
    } else {
        callback();
    }
}
function runCallback(){
    if(callbackMethod){
        callbackMethod();
    }
}

function initUser(callback){
    var user = getUserInfo();
    if(isCleanUser == true){
        user = null;
    }
    if (isBlack(user)) {
        getVisitor(function () {
            callback();
        });
    } else {
        callback();
    }
}

function initSystemInfo(callBack){

    if($api.getStorage(isInit)){
        _initSystemInfo();//异步刷新系统信息
        callBack();
    } else {
        api.showProgress({
            style: 'default',
            animationType: 'fade',
            title: '系统初始化中...',
            modal: true
        });
        _initSystemInfo(function(){
            api.hideProgress();
            callBack();
        });
    }
}


function _initSystemInfo(callback){

    ajaxGet(initSystemInfoUrl,{},function(ret,err){
        if(isNotBlack(ret)){

            //=====系统初始化的请写到这里。======
            setIncomeInfo(ret.incomes);
            setAreaInfo(ret.areas);
            setEducationFilter(ret.educationFilters);
            setEducationInfo(ret.educations);
            setProfessionInfo(ret.professions);
            setIncomFilterInfo(ret.incomeFilters);
            setIndustryInfo(ret.industries);

            $api.setStorage(isInit,true);
            $api.setStorage('showPrice',ret.earnScoreDisplayPrice);
            var time =  $api.getStorage(lastTime);
            var goldBeanNumTime =  $api.getStorage("goldBeanNumTime");

            if(typeof (time) =='undefined'){
                time = 0;
            }

            if(typeof (goldBeanNumTime) =='undefined'){
                goldBeanNumTime = 0;
            }
            ajaxGet(unreadMessageNum,{lastTime:time},function(ret){
                if(isNotBlack(ret)&&isNotBlack(ret.unreadNum)){
                    //有红点，需要加上
                    if(ret.unreadNum > 0){
                        document.getElementById('userNoticeDiv').style.display = 'block';
                        $api.setStorage("redPint",true);
                        $api.setStorage(lastTime,new Date().getTime());
                    }else{
                        $api.setStorage(lastTime,new Date().getTime());
                        $api.setStorage("redPint",false);
                    }
                }
            });

            ajaxGet(unreadGoldBeanNum,{lastTime:goldBeanNumTime},function(ret){
                if(isNotBlack(ret)&&isNotBlack(ret.unreadNum)){
                    //有红点，需要加上
                    if(ret.unreadNum > 0){
                        document.getElementById('userNoticeDiv').style.display = 'block';
                        $api.setStorage("beanPoint",true);
                        $api.setStorage("goldBeanNumTime",new Date().getTime());
                    }else{
                        $api.setStorage(lastTime,new Date().getTime());
                        $api.setStorage("goldBeanNumTime",false);
                    }
                }
            });
            if(callback){
                callback();
            }
        }else{
            if(callback){
                api.confirm({
                    title: '当前网络或服务有问题',
                    msg: '是否重试？',
                    buttons:['确定', '取消']
                },function(ret,err){
                    if(ret.buttonIndex == 1){
                        _initSystemInfo(callback);
                    }else{
                        closeApp();
                    }
                });
            }
        }
    });


}



function setIncomeInfo(ret) {
    if(ret){
        var income = new Array();
        for(var i = 0; i < ret.length; i++){
            var obj = {};
            obj.text = ret[i].name;
            obj.value = ret[i].id;
            income.push(obj);

        }

        $api.setStorage("income", income);
    }
}



function setIndustryInfo(ret){
    if(ret){
        $api.setStorage("industry", ret);
    }
}

function setEducationInfo(ret) {
    if(ret){
        var education = new Array();
        for(var i = 0; i < ret.length; i++){
            var obj = {};
            obj.text = ret[i].name;
            obj.value = ret[i].id;
            education.push(obj);
        }

        $api.setStorage("education", education);
    }
}


function setAreaInfo(ret) {
    if(ret) {
        var cityData = new Array();
        for (var i = 0; i < ret.length; i++) {
            var obj = {};
            obj.text = ret[i].parent.name;
            obj.value = ret[i].parent.id;
            var children = new Array();
            var subs = ret[i].subs;
            for (var j = 0; j < subs.length; j++) {
                var cl = {};
                cl.text = subs[j].name;
                cl.value = subs[j].id;
                children.push(cl);
            }
            obj.children = children;
            cityData.push(obj);
        }
        $api.setStorage("cityData", cityData);

    }
}

function setProfessionInfo(ret) {
    if(ret){
        var profession = new Array();
        for(var i = 0; i < ret.length; i++){
            var obj = {};
            obj.text = ret[i].parent.name;
            obj.value = ret[i].parent.id;
            var children = new Array();
            var subs= ret[i].subs;
            for(var j = 0;j < subs.length;j++){
                var cl = {};
                cl.text = subs[j].name;
                cl.value = subs[j].id;
                children.push(cl);
            }
            obj.children = children;
            profession.push(obj);
        }

        $api.setStorage("profession", profession);
        $api.setStorage("shopProfession", ret);
    }
}


function setIncomFilterInfo(ret) {
    if(ret){
        var incomeFilter = new Array();
        incomeFilter.push({text:"不限",value:0});
        for(var i = 0; i < ret.length; i++){
            var obj = {};
            obj.text = ret[i].name;
            obj.value = ret[i].id;
            incomeFilter.push(obj);
        }

        $api.setStorage("incomeFilter", incomeFilter);
    }
}


function setEducationFilter(ret) {
    if(ret){
        var educationFilter = new Array();
        educationFilter.push({text:"不限",value:0});
        for(var i = 0; i < ret.length; i++){
            var obj = {};
            obj.text = ret[i].name;
            obj.value = ret[i].id;
            educationFilter.push(obj);
        }
        $api.setStorage("educationFilter", educationFilter);
    }
}


function initOther(callBack){



    //初始化动态红点
    //var preTime = $api.getStorage(Storage_Action_Notice);
    //var now = new Date().format("yyyyMMdd");
    //if(!preTime || preTime < now){
    //    $api.byId('actionNoticeDiv').style.display = 'block';
    //}





    if(callBack){
        callBack();
    }


}



function getVisitor(callback){

    api.ajax({
        url: loginVisitorUrl,
        method: 'post',
        timeout: 60,
        dataType: 'json',
        returnAll: false,
        headers: {
            "Accept-Encoding": "gzip",
            "version" : version,
            "type" :   1
        },
        data: {}
    }, function (ret, err) {
        if(isNotBlack(ret) && ret.token){
            user = ret;
            setUserInfo(user);
            callback();
        }else{
            api.confirm({
                title: '当前网络或服务有问题',
                msg: '是否重试？',
                buttons:['确定', '取消']
            },function(ret,err){
                if(ret.buttonIndex == 1){
                    getVisitor(callback);
                }else{
                    closeApp();
                }
            });
        }
    });
}




//初始化是否是个人还是商家
function initUserPage(callback){
    api.closeWin({
        name:"login"
    });

    var user = getUserInfo();
    //判断是否是游客;
    if(isBlack(user.phone)){
        callback(1);
        return;
    }
    //判断是否是商家用户
    if(isNotBlack(user.shopName)){

        callback(2);
        return;
    }

    callback(3);
}


//======================系统初始化（结束）=============================





//======================下方tab栏目切换（开始）=============================

var prevPid;//上一个tab
var curPid;//当前tab
var frameArr = [];//打开的列表
//各个栏目


//点击切换tab标签
function openTab(type) {

    if (!type) {
        return;
    }
    if ( type == 'user') {
        var isCheck = checkUserLogin('./html/login/login.html');
        if(!isCheck){
            return;
        }
    }

    //切换样式
    var header = $api.dom('#header .active');//对应头部的样式
    $api.removeCls(header, 'active');
    var thisHeader = $api.dom('#header .' + type);
    $api.addCls(thisHeader, 'active');
    var actTab = $api.dom('#nav .active');//对应底部的样式
    $api.removeCls(actTab, 'active');
    var thisTab = $api.dom('#nav .' + type);
    thisTab = thisTab.parentNode;
    $api.addCls(thisTab, 'active');


    //record page id
    prevPid = curPid;
    curPid = type;


    if (prevPid != curPid) {
        if (isOpened(type)) {
            //打开已经打开过的页面
            if (tabs[type].isGroup) {
                api.setFrameGroupAttr({
                    name: type,
                    hidden: false
                });
            } else {
                api.setFrameAttr({
                    name: type,
                    hidden: false
                });
            }

        } else {
            //打开新页面
            if (tabs[type].isGroup) {
                api.openFrameGroup(tabs[type].group, function (ret, err) {
                    tabs[type].groupCallBack(ret);
                });
            } else {
                api.openFrame(tabs[type].frame);
            }

            frameArr.push(type);


        }

        if (prevPid) {
            //关闭前一个页面
            if (tabs[prevPid].isGroup) {
                api.setFrameGroupAttr({
                    name: prevPid,
                    hidden: true
                });
            } else {
                api.setFrameAttr({
                    name: prevPid,
                    hidden: true
                });
            }

        }
    }

};


//是否打开过
function isOpened(frmName) {
    var i = 0, len = frameArr.length;
    for (i; i < len; i++) {
        if (frameArr[i] == frmName) {
            return true;
        }
    }
    return false;
}


//======================下方tab栏目切换（结束）=============================
