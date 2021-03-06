import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import {MessageBox} from './ui/MessageBox';
import {postJson} from './vox/fetch';
import 'whatwg-fetch';
import {Global} from './global';
import MarkdownElement from './ui/MarkdownElement';
import {ljshell} from './ljshell';

console.info('Import Login...');
class Login extends Component{
    constructor(props){
        super(props);
        this.state={
            exitButton : false,
            msg:'正在登录请稍候...',
        };
    }
    logout(){
        fetch('/users/logout',{method:'POST',
        credentials: 'same-origin',
        headers: {'Content-Type': 'application/json'}}).then(function(responese){
			return responese.text();
		}).then(function(data){
        }).catch(function(e){
            this.messageBar(e);
        });        
    }
    login(uid,uname,cookie){        
        if(!(uid && uname && cookie)){
            //this.setState({exitButton:true,msg:"用户信息不正确"});
            console.log('Use cookie login...');
            //return;
        }else{
            console.log('login...');
            console.log(`${uid} , ${uname} ,${cookie}`);
            Global.setUserInfo(uid,uname,cookie);
        }
        let data={uid,sum:Global.getSUM(),uname,cookie,
            platform:Global.getPlatfrom(),
            entryrandom:window.entryrandom};
        fetch('/users/login',{method:'POST',
        credentials: 'same-origin',
        headers: {'Content-Type': 'application/json'},
        body:JSON.stringify(data)}).then(function(responese){
			return responese.text();
		}).then(function(data){
            let json;
            try{
                json = JSON.parse(data);
            }catch(e){
                this.setState({exitButton:true,msg:"服务器故障请稍后再试."});
                return;
            }
            /**
             * login 返回的结构
             * result = 'ok' 表示成功，其他是错误信息
             * lv   当前关卡
             * olv  解锁关卡
             * uid | user | cookie
             * config 配置字串
             * clsid 班级id
             * cls  当前班级其他人的完成情况
             *      [
             *          {uid,UserName,lv,lastcommit,crown},
             *      ]
             * lvs  自己已完成关卡的情况
             *      [
             *          {rank,lv,blocks,best}, 
             *          rank    排名数1是第一名,0没有排名
             *          lv      表示那一关
             *          blocks  自己完成的块数
             *          best    本关最佳块数
             *      ]
             * crown 得到到皇冠数量
             * trashlv     临时代码块对应的关。
             * trash       临时代码块，还没有通，但是已经有一些编辑了。
             */
            Global.setLoginJson(json);
            if(json.result==='ok'){
                //成功登录
                this.setState({open:false});
                Global.loadConfig(json.config);
                Global.setMaxPassLevel(json.lv+1);
                Global.setMaxUnlockLevel(json.olv);
                Global.setUserName(json.user);
                //通过cookie登录
                if(json.cookie)
                    Global.setUserInfo(json.uid,json.user,json.cookie);
                this.setState({msg:"登录成功"});
                Global.wsLogin();
                //location.href='#main/'+(json.lv+1);
                location.href='#/main';//eslint-disable-line
            }else{
                if(json&&json.result)
                    this.setState({exitButton:true,msg:json.result});
                else
                    this.setState({exitButton:true,msg:"服务器返回错误."});
            }
        }.bind(this)).catch(function(e){
            this.setState({exitButton:true,msg:e.toString()});
        }.bind(this));
        /**
         * GPS
         */
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition((pos)=>{
                console.log('YOUR POSITION:');
                console.log(pos);
                if(pos){
                    let {latitude,longitude} = pos.coords;
                    let gps = {uid,latitude,longitude};
                    console.log(gps);
                    postJson('/users/postpos',gps,(json)=>{
                        if(json && json.result==='ok')
                            console.log('GPS OK.');
                        else
                            console.log('GPS Failed.');
                    });    
                }
            });
        }else{
            console.log("NOT GPS");
        }        
    }
    ljinit(){
        ljshell.init((b,e)=>{
            if(b){
                let userinfo = ljshell.getUserInfo();
                if(userinfo && userinfo.userid && userinfo.nickname && userinfo.token){
                    //this.setState({exitButton:false,msg:`${userinfo.userid},${userinfo.token}`});
                    this.login(userinfo.userid,userinfo.nickname,"sc1="+userinfo.token);
                }else{
                    this.setState({exitButton:false,msg:"getUserInfo 返回非预期的值:\n"+userinfo.toString()});
                }
            }else{
                //调试进入游戏
                if(window.LOCALHOST){//eslint-disable-line
                    let m = location.hash.match(/#\/login\/(.*)\/(.*)\/(.*)/);//eslint-disable-line
                    if(m){
                        this.login(m[1],m[2],m[3]);
                    }else{
                        this.login(144969,"刘国辉","sc1=8B8CE39290C7C1A0C01BAE4250E3429EF24D94ECakl7OwfmBZfKjGwJJVFk7lAsYQvwMBji7UyIisLP61YoQVaIwXsmayP59U6N9kT7EuDokYJfkGeZ1SEPpXZZOrYjwOW7juvVpVYDelFdy2LXfKgNvHozQkyjwT7PHWTJAcMa1NS7wSvmnrVqfljhwtGC5XHjzw%3d%3d");
                    }
                }
                this.setState({exitButton:false,msg:e});
            }
        },(msg)=>{
            //this.setState({exitButton:false,msg:msg});
        });
    }
    componentDidMount(){
        this.ljinit();
    }
    quitApp(){
        ljshell.quit();
    }
    tryAgin(){
        this.ljinit();
    }
    render(){
        return <Dialog open={true}
            autoScrollBodyContent={true}
            contentStyle={Global.getPlatfrom()!=="windows"?{width:"95%"}:undefined}
            actions={this.state.exitButton?
            [<FlatButton label='重试' primary={true} onClick={this.tryAgin.bind(this)}/>,
            (window.native&&window.native.quit)?<FlatButton label='退出' primary={true} onClick={this.quitApp.bind(this)}/>:undefined]:undefined}>
            {this.state.msg}
            </Dialog>;
    }
};

export default Login;

