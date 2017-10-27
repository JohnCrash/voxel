import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {Global} from './global';
import TextField from 'material-ui/TextField';

class LevelDebug extends Component{
    constructor(props){
        super(props);
        this.state = {
            open:false
        }
    }
    open(cb){
        this._cb = cb;
        this.setState({open:true});
    }
    handleClose(result){
        if(result==='ok'){
            let lv = Number(this.lv.getValue());
            let olv = Number(this.olv.getValue());
            Global.setMaxPassLevel(lv);
            Global.setMaxUnlockLevel(olv);
        }else{
            //...
        }
        this.setState({open:false});
        if(this._cb)this._cb(result);
    }
    render(){
        return <Dialog
            actions={[<FlatButton
                    label="取消"
                    primary={true}
                    onClick={this.handleClose.bind(this,'cancel')}/>,
                    <FlatButton
                    label="确定"
                    primary={true}
                    onClick={this.handleClose.bind(this,'ok')}/>]}
            open = {this.state.open}
        >
            <div>打开关卡
                <TextField
                    hintText="lv"
                    ref={ref=>this.lv=ref}
                    defaultValue={Global.getMaxPassLevel()}
                />
            </div>
            <div>解锁关卡
                <TextField
                    hintText="olv"
                    ref={ref=>this.olv=ref}
                    defaultValue={Global.getMaxUnlockLevel()}
                />
            </div>
        </Dialog>
    }
}

export default LevelDebug;