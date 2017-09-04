/**
 * 关卡选择
 */
import React, {Component} from 'react';
import {fetchJson} from './vox/fetch';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import AppBar from 'material-ui/AppBar';

const buttonStyle = {
    borderRadius:'18px',
    width:'36px'
};
const style = {
    marginRight: 20,
  };
class LevelSel extends Component{
    constructor(props){
        super(props);
        this.state={
            title:''
        };
    }
    load(name){
        fetchJson(`scene/${name}.index`,(json)=>{
            this.level = json.level.map((item)=>{
                let bl = [];
                let m = item.rang.match(/(\d+)-(\d+)/);
                if(m){
                    for(let i=m[1];i<=m[2];i++){
                        bl.push(<FloatingActionButton key={i} mini={true} style={style} backgroundColor='#FFFFFF'>
                                {i}
                            </FloatingActionButton>);
                    }
                }
                return <div key={item.name}>
                            {item.name}
                            <div>
                                {bl}
                            </div>
                        </div>;
            });
            this.setState({title:json.title});
        });
    }
    componentDidMount(){
        this.load(this.props.index);
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.index!=this.props.index){
            this.load(nextProps.index);
        }
    }    
    render(){
        return <div>
            <AppBar title={this.state.title}/>
            {this.level}
        </div>;
    }
};

export default LevelSel;