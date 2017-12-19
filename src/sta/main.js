import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Sta1 from './sta1';
import Sta2 from './sta2';
import Sta3 from './sta3';
import Sta4 from './sta4';

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
        let Sta;
        switch(this.state.sta){
            case 1:Sta = <Sta1 />;break;
            case 2:Sta = <Sta2 />;break;
            case 3:Sta = <Sta3 />;break;
            case 4:Sta = <Sta4 />;break;
        }
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
                <MenuItem primaryText="关卡人数分布图-0" checked={this.state.sta===1} onClick={this.onChange.bind(this,1)}/>
                <MenuItem primaryText="关卡人数分布图" checked={this.state.sta!==1} onClick={this.onChange.bind(this,2)}/>
                <MenuItem primaryText="关卡用时分布图" checked={this.state.sta!==1} onClick={this.onChange.bind(this,3)}/>
                <MenuItem primaryText="关卡总用时分布图" checked={this.state.sta!==1} onClick={this.onChange.bind(this,4)}/>
            </Menu>
        </Popover>
        {Sta}
        </div>;
    }
};

export default Main;