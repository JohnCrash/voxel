import React, {Component} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import m from './mix';
import { setTimeout } from 'timers';

class ConfirmButton extends RaisedButton{
    constructor(props){
        super(props);
        this.state={
            flag : 0
        };
    }
    componentWillUnmount(){
        if(this._id)clearInterval(this._id);
    }    
    handleClick=()=>{
        let {flag,cooldown} = this.state;
        if(flag===0){
            this.setState({flag:1});
            if(this._id)clearInterval(this._id);

            this._id = setInterval(()=>{
                if(this.state.flag===1)
                    this.setState({flag:0});
                clearInterval(this._id);
                this._id = null;
            },2000);
        }else if(flag===1){
            this.props.onClick();
            this.setState({flag:2});
        }
    }
    render(){
        let {flag} = this.state;
        let props = m(this.props,flag===1?{backgroundColor:'#EF5350',label:'确认',labelColor:'#FFFFFF'}:{onClick:this.handleClick});
        return <RaisedButton {...props} />;
    }
};

export default ConfirmButton;