var topbar;

var TopBar = function (callback,datas,overload){
	this.datas = datas;
	this.callback = callback;
	this.selIndex = new Array(this.datas.length);
	topbar = this;
	for (var m in overload) {
        if (this[m]) {
            this[m] = overload[m];
        }
    }
	this.createBar();
}

TopBar.prototype = {
	
	createBar : function(){
		
		var searchBarDiv = document.createElement('div');
		searchBarDiv.className = "searchBar";
		
		var searchDiv = document.createElement('div');
		searchDiv.className = "search";
		
		var input = document.createElement('input');
		input.className = "keyWord";
		input.type = "text";
		input.placeholder = "请输入关键字";
		
		var span = document.createElement('span');
		span.className = "searchBtn";
		span.innerText = "搜索";
		span.onclick = function(){
			var searchwords = input.value;
			topbar.searchwords = searchwords;
			topbar.selected();
		};
		
		searchDiv.appendChild(input);
		searchDiv.appendChild(span);
		searchBarDiv.appendChild(searchDiv);
		document.body.appendChild(searchBarDiv);
		
		var topDiv = document.createElement('div');
		topDiv.className = "top";
		
		var ul = document.createElement('ul');
		
		for(var i = 0;i < this.datas.length;i++){
			var li = document.createElement('li');
			li.id = "topbar_" + i;
			li.index = i;
			
			if(isBlack(this.datas[i].values)){
				continue;
			}
			
			if(isNotBlack(this.datas[i].values[0].sub)){
				li.innerText = this.datas[i].values[0].sub[0].name;
			}else{
				li.innerText = this.datas[i].values[0].name;
			}
			
			li.onclick = function(){
				topbar.open(this.index);
			}
			
			ul.appendChild(li);
		}
		topDiv.appendChild(ul);
		document.body.appendChild(topDiv);
	},
	beforeOpenSearch : function(){
		
	},
	openSearch : function(){
		this.beforeOpenSearch();
		document.getElementsByClassName('searchBar')[0].style.display = 'block';
		this.isOpenSearch = true;
	},
	beforeCloseSearch : function(){
		
	},
	closeSearch : function(){
		this.beforeCloseSearch();
		document.getElementsByClassName('searchBar')[0].style.display = 'none';
		this.isOpenSearch = false;
	},
	beforeOpen : function(){
		
	},
	open : function(index){
		this.beforeOpen();
		this.close();
		var bottomDiv = document.createElement('div');
		bottomDiv.className = "bottom";
		
		var leftDiv = document.createElement('div');
		leftDiv.className = "left";
		
		leftDiv.onclick = function(){
			topbar.selected();
		}
		
		var height = api.frameHeight - 32;
		if(this.isOpenSearch){
			height = api.frameHeight - 32 - 41;
		}
		
		leftDiv.style.height = height + "px";
		
		var notSub = false;
		
		var ul = document.createElement('ul');
		
		for(var i = 0 ;i < this.datas[index].values.length;i++){
			var li = document.createElement('li');
			li.innerText = this.datas[index].values[i].name;
			li.firstLevel = i;
			li.index = index;
			
			if(isNotBlack(this.selIndex[index]) && this.selIndex[index].firstLevel == i){
				li.className = "selected";
			} else if (isBlack(this.selIndex[index]) && i == 0){
				li.className = "selected";
			}
			
			if(isBlack(this.datas[index].values[i].sub)){
				li.onclick = function(){
					topbar.selected(this);
				}
			}else{
				notSub = true;
				li.onclick = function(){
					var rightDiv = document.getElementsByClassName("right")[0];
					if(isNotBlack(rightDiv)){
						rightDiv.remove();
					}
					document.getElementsByClassName("selected")[0].className = "";
					this.className = "selected";
					topbar.openSubLevel(index,this.firstLevel);
				}
			}
			
			ul.appendChild(li);
		}
		
		leftDiv.appendChild(ul);
		bottomDiv.appendChild(leftDiv);
		document.body.appendChild(bottomDiv);
		
		if(!notSub){
			leftDiv.style.width = "100%";
			leftDiv.style.backgroundColor = "#FFFFFF";
			document.getElementsByClassName("selected")[0].className = "secondSelected";
			var lis = leftDiv.getElementsByTagName("li");
			for(var i = 0;i < lis.length;i++){
				var li = lis[i];
				li.style.borderBottom = "1px solid rgb(231,231,231)";
//				li.style.paddingLeft = "20px";
			}
		}
		
		//判断是否已经选过
		var firstLevel = 0;
		if (isNotBlack(this.selIndex[index])){
			firstLevel = this.selIndex[index].firstLevel;
		}
		
		if(isNotBlack(this.datas[index].values[firstLevel].sub)){
			this.openSubLevel(index,firstLevel);
		}
		
	},
	openSubLevel : function (index,firstLevel) {
		var rightDiv = document.createElement('div');
		rightDiv.className = "right";
		
		var height = api.frameHeight - 32;
		if(this.isOpenSearch){
			height = api.frameHeight - 32 - 41;
		}
		rightDiv.style.height = height + "px";
		
		var ul = document.createElement('ul');
		for(var i = 0 ;i < this.datas[index].values[firstLevel].sub.length;i++){
			var li = document.createElement('li');
			li.innerText = this.datas[index].values[firstLevel].sub[i].name;
			li.index = index;
			li.firstLevel = firstLevel;
			li.secondLevel = i;
			li.value = this.datas[index].values[firstLevel].sub[i].value;
			
			if(isNotBlack(this.selIndex[index]) && this.selIndex[index].firstLevel == firstLevel 
				&& this.selIndex[index].secondLevel == i){
				li.className = "secondSelected";
			} else if (isBlack(this.selIndex[index]) && i == 0){
				li.className = "secondSelected";
			}
			
			li.onclick = function(){
				topbar.selected(this);
			}
			
			ul.appendChild(li);
		}
		
		rightDiv.appendChild(ul);
		document.getElementsByClassName("bottom")[0].appendChild(rightDiv);
	},
	selected : function(dom){
		if(dom){
			this.selIndex[dom.index] = {
				firstLevel : dom.firstLevel,
				secondLevel : dom.secondLevel
			}
			
			document.getElementById("topbar_"+dom.index).innerText = dom.innerText;
		}
		
		this.close();
		this.afterSelected();
		
		if(this.callback){
			var params = {};
			for(var i = 0; i < this.selIndex.length;i++){
				var index = this.selIndex[i];
				if(isNotBlack(index)){
					var firstLevel = index.firstLevel;
					var secondLevel = index.secondLevel;
					var query = this.datas[i].query;
					var value;
					
					if(isNotBlack(secondLevel)){
						value = this.datas[i].values[firstLevel].sub[secondLevel].id;
					}else{
						value = this.datas[i].values[firstLevel].id;
					}
					
					params[query] = value;
				}
			}
			
			var searchwords = document.getElementsByClassName('keyWord')[0].value;
			if(isNotBlack(searchwords)){
				params.searchwords = searchwords;
			}
			
			this.callback(params);
		}
	},
	afterSelected : function(){
		
	},
	close : function(){
		var bottomDiv = document.getElementsByClassName('bottom')[0];
		if(isNotBlack(bottomDiv)){
			bottomDiv.remove();
		}
	}
};
