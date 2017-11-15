import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Sta1 from './sta1';
import Sta2 from './sta2';

class Main extends Component{
    constructor(props){
        super(props);
        this.state={
            openMenu:false,
            sta:1
        };
    }
    onMenu(event){
        event.preventDefault();
        
        this.setState({
            openMenu: true,
            anchorEl: event.currentTarget,
        });
    }
    handleRequestClose(){
        this.setState({
            openMenu: false,
          });
    }
    onChange(s){
        this.setState({
            openMenu: false,
            sta:s
          });        
    }
    render(){
        return <div><AppBar title="乐学编程用户统计"
            onLeftIconButtonTouchTap={this.onMenu.bind(this)}></AppBar>
            <Popover
            open={this.state.openMenu}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            onRequestClose={this.handleRequestClose.bind(this)}
            >
            <Menu>
                <MenuItem primaryText="用户活跃" checked={this.state.sta===1} onClick={this.onChange.bind(this,1)}/>
                <MenuItem primaryText="关卡完成" checked={this.state.sta!==1} onClick={this.onChange.bind(this,2)}/>
            </Menu>
        </Popover>
        {this.state.sta===1?<Sta1/>:<Sta2/>}
        </div>;
    }
};

export default Main;