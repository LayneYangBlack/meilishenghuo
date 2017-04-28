/**
 * Created by PC on 2016/7/25.
 */

function addEveLongPress(map){
    map.addEventListener({
        name: 'viewChange'
    },function(ret){
        if(ret.status){
            map.getCenter(function(ret){
              if(ret){
                  apiLocal = ret;

                  map.addCircle({
                      id:1,
                      center: {
                          lon: ret.lon,
                          lat: ret.lat
                      },
                      radius: radius,
                      styles: {
                          borderColor: '#FF0000',
                          borderWidth: 3,
                          fillColor:'rgba(192,192,192,0.5)'
                      }
                  });
                  map.getNameFromCoords({
                      lon: ret.lon,
                      lat: ret.lat
                  },function(ret,err){
                      if(ret.status){
                          document.getElementById('seat').innerHTML = ret.address;
                      }
                  });
                  //搜索
                  map.searchNearby({
                      keyword: "店铺",
                      lon:ret.lon,
                      lat: ret.lat,
                      radius:radius
                  },function(ret,err){
                      if(ret.status){
                          var data = setMapPointList(ret.results);
                          var allResultList = {};
                          for(var i = 0;i< data.length;i++){
                              allResultList[data[i].id] = data[i];
                          }
                          map.addAnnotations({
                              annotations: data,
                              draggable: true
                          }, function(ret){
                              if(ret){
                                  document.getElementById('seat').innerHTML = allResultList[ret.id].address;
                                  apiLocal =  allResultList[ret.id];
                              }
                          });
                      }else{
                      }
                  });
              }
            });

        }
    })
}

function addCircle(map,ret,radius) {
    map.addCircle({
        id: 1,
        center: {
            lon: ret.lon,
            lat: ret.lat
        },
        radius: radius,
        styles: {
            borderColor: '#FF0000',
            borderWidth: 3,
            fillColor: 'rgba(192,192,192,0.5)'
        }
    });
}


function addEve(map,callback){
    map.addEventListener({
        name: 'viewChange'
    },function(ret){
        if(ret.status){
            map.getCenter(function(ret){
                if(ret){
                    apiLocal = ret;
                    map.getNameFromCoords({
                        lon: ret.lon,
                        lat: ret.lat
                    },function(ret,err){

                        if(ret.status){
                            if(callback){
                                callback(ret);
                            }
                        }
                    });
                }
            });

        }
    })
}

var ponitList = [];
function setMapPointList(data){
    //先清除点
    removeMapPointList();
    ponitList = [];
    if(isNotBlack(data)){
        for(var i = 0; i < data.length;i++){
            var id = getMapId();
            data[i].id = id;
            ponitList.push(id);
        }
        return data;
    }
}

function removeMapPointList(){
    var map = api.require('bMap');
    map.removeAnnotations({
        ids: ponitList
    });
}

var mapId = 1;
function getMapId(){
    return ++mapId;
}

