import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import {MessageBox} from './ui/messagebox';
import 'whatwg-fetch';

class Login extends Component{
    constructor(props){
        super(props);
        this.state={
            open:false         
        };
    }
    messageBar(str,f){
        console.log(str);
        /*
        MessageBox.show('ok',undefined,str,(result)=>{
            console.log(result);
        });*/
    }      
    login(user,pwd){
        let data={
            user:user?user:'',
            passwd:pwd?pwd:''
        };
        fetch('/users/login',{method:'POST',
        credentials: 'same-origin',
        headers: {'Content-Type': 'application/json'},
        body:JSON.stringify(data)}).then(function(responese){
			return responese.text();
		}).then(function(data){
            console.log(data);
            let json = JSON.parse(data);
            if(json.result==='ok'){
                //成功登录
                //this.props.onLogin(json.user);
                this.setState({open:false});
                location.href='#main#'+(json.lv+1);
            }else{
                if(user)this.messageBar(json.result);
                this.setState({open:true});
            }
        }.bind(this)).catch(function(e){
            this.messageBar(e);
            this.setState({open:true});
        }.bind(this));
    }
    logout(){
        this.setState({open:true});
        fetch('/users/logout',{method:'POST',
        credentials: 'same-origin',
        headers: {'Content-Type': 'application/json'}}).then(function(responese){
			return responese.text();
		}).then(function(data){
        }).catch(function(e){
            this.messageBar(e);
        });        
    }
    componentDidMount(){
        this.login();
    }
    openLogin(){
        let user = this.user.getValue();
        let pwd = this.pwd.getValue();
        this.login(user,pwd);
    }
    render(){
        return <Dialog open={this.state.open}
            title={'登录'}actions={[<FlatButton label='登录' primary={true} onClick={this.openLogin.bind(this)}/>]}>
            <p>请输入用户名和密码:</p>
            <TextField
                hintText="用户名"
                floatingLabelText="请输入用户名"
                ref={(ref)=>{this.user=ref}}/>
            <TextField
                hintText="密码"
                type="password"
                floatingLabelText="请输入密码"
                ref={(ref)=>{this.pwd=ref}}/>
            </Dialog>;
    }
};

export default Login;

