import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import {MessageBox} from './ui/messagebox';
import 'whatwg-fetch';
import {Global} from './global';
import MarkdownElement from './ui/markdownelement';

class Login extends Component{
    constructor(props){
        super(props);
        this.state={
            exitButton : false,
            msg:'正在登录请稍后...',
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
        let data={uid,uname,cookie};
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
            if(json.result==='ok'){
                //成功登录
                this.setState({open:false});
                Global.loadConfig(json.config);
                console.log("setMaxPassLevel "+(json.lv+1));
                Global.setMaxPassLevel(json.lv+1);
                Global.setUserName(json.user);
                //通过cookie登录
                if(json.cookie)
                    Global.setUserInfo(json.uid,json.uname,json.cookie);
                this.setState({msg:"登录成功"});
                //location.href='#main/'+(json.lv+1);
                location.href='#/main';
            }else{
                if(json&&json.result)
                    this.setState({exitButton:true,msg:json.result});
                else
                    this.setState({exitButton:true,msg:"服务器返回错误."});
            }
        }.bind(this)).catch(function(e){
            this.setState({exitButton:true,msg:e.toString()});
        }.bind(this));
    }
    componentDidMount(){
        let {uid,uname,cookie} = this.props;
        this.login(uid,uname,cookie);
    }
    componentWillReceiveProps(nextProps){
        let {uid} = this.props;
        if(uid!==nextProps.uid){
            let {uid,uname,cookie} = nextProps;
            this.login(uid,uname,cookie);
        }
    }
    quitApp(){
        native.quit();
    }
    tryAgin(){
        let {uid,uname,cookie} = this.props;
        this.login(uid,uname,cookie);
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

