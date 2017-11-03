import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import AppBar from 'material-ui/AppBar';
import LevelSel from './levelsel';
import Level from './level';
import {Global} from './global';
import {
    Redirect
  } from 'react-router-dom';
import MainDrawer from './drawer';

let app;
/**
 * 全局函数为应用指定一个标题
 */
global.appTitle = function(t){
    app.appTitle(t);
}

class Main extends Component{
    constructor(props){
        super(props);
        this.state = {
            title : '',
            anchorEl : null,
            isdebug : false,
        }
        app = this;
    }
    appTitle(t){
        this.setState({title:t});
    }
    componentDidMount(){
        document.title = "学编程";
    }
    onMenu(event){
        event.preventDefault();
        this.drawer.open(true);
    }
    render(){
        if(Global.getMaxPassLevel()===null){
            return <Redirect to='/login' />;
        }
        return <div><AppBar key='mainbar' title={this.state.title} onLeftIconButtonTouchTap={this.onMenu.bind(this)}/>
            <MainDrawer key='mydrawer' loc='main' ref={ref=>this.drawer=ref}/>
        <LevelSel key='levelselect' index='main' current={Global.getMaxPassLevel()} 
            other={ Global.getLoginJson()? Global.getLoginJson().cls:null} 
            unlock={Global.getMaxUnlockLevel()}/>
        </div>;
    }
};

export default Main;