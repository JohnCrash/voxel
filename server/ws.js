var WebSocket = require('faye-websocket');
var config = require('./config');
var Sql = require('mssql');

function sql(query){
    return new Sql.ConnectionPool(config.sqlserver).connect().then(pool=>{
      return pool.request().query(query);
    });
}

function sqlAction(uid,action){
    sql(`insert into UserStream (uid,action,date) values (${uid},N'${action}',getdate())`).then(
        ()=>{}
    ).catch((e)=>{
        console.log(e);
    });
}
//在线的用户
var liveUsers = {};
var wsToCls = new WeakMap(); //将ws映射为一个cls

function sendMsg(ws,t){
    try{
        ws.send(JSON.stringify(t));
    }catch(e){
        console.log(e);
    }
}
function reciveMsg(event){
    try{
        return JSON.parse(event.data);
    }catch(e){
        console.log(e);
    }
}

/**
 * 加入一个在线用户
 */
function add(t,ws){
    let {uid,cls,lv,name} = t;
    if(cls==='0' || cls===0){
        //忽略cls为0的无班级用户
        ws.close();
    }else{
        if( !liveUsers[cls] )
            liveUsers[cls] = [];
        let clss = liveUsers[cls];
        for(let c of clss){
            sendMsg(c.ws,{event:'enter',uid,lv,cls,name});
        }
        liveUsers[cls].push({uid,cls,lv,name,ws});
        wsToCls.set(ws,cls);
    }
}
/**
 * 在线用户uid的关卡前进了
 */
function pass(t,ws){
    let {uid,cls,lv,name,rank,blocks} = t;
    let clss = liveUsers[cls];
    if(clss){
        for(let c of clss){
            if(c.uid===uid){
                c.lv = lv; //更新自己
                c.ws = ws;
            }else{//通知同班同学
                sendMsg(c.ws,{event:'pass',uid,lv,cls,name,rank,blocks})
            }
        }
    }
}

/**
 * 删除一个ws对应的用户
 */
function remove(ws){
    let cls = wsToCls.get(ws);
    if(cls){
        let clss = liveUsers[cls];
        if(clss){
            let o;
            for(let i=0;i<clss.length;i++){//从班级表中删除
                if(clss[i] && clss[i].ws===ws){
                    o = clss[i];
                    clss.splice(i,1);
                    sqlAction(o.uid,'exit');
                    break;
                }
            }
            if(clss.length>0){//通知离线
                if(o){
                    for(let c of clss){
                        sendMsg(c.ws,{event:'exit',uid:o.uid,cls:o.cls,name:o.name,lv:o.lv});
                    }
                }
            }else{
                delete liveUsers[cls]; //都离线了删除班级表
            }
        }
    }
}
/**
 * websocket接口
 */
function upgrade(request, socket, body){
    if(WebSocket.isWebSocket(request)){
        if(request.url==='/clslv'){
            var ws = new WebSocket(request, socket, body);
            ws.on('message',function(event){
                if(typeof event.data === 'string'){
                    let t = reciveMsg(event);
                    if(t){
                        switch(t.event){
                            case 'login':
                                add(t,ws);
                                break;
                            case 'pass':
                                pass(t,ws);
                                break;
                        }
                    }
                }
            });
            ws.on('close',function(event){
                remove(ws);
            });
        }
    }
}

module.exports = upgrade;