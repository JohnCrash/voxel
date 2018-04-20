/**
 * 后台管理班级列表
 */
import React, {Component} from 'react';
import FlatButton from 'material-ui/FlatButton';
import {MessageBox} from './ui/MessageBox';
import {Global} from './global';
import MarkdownElement from './ui/MarkdownElement';
import {ljshell} from './ljshell';
import {List, ListItem} from 'material-ui/List';
import ClassIcon from 'material-ui/svg-icons/social/people';
import {postJson} from './vox/fetch';

class BgMgr extends Component{
    constructor(props){
        super(props);
        this.state = {
            data : null
        };
    }
    componentDidMount(){
        /*
            把这个放到上一层
            postJson('users/myclass',{},(json)=>{
                if(json.result==='ok'){
                    this.setState({data:json.classes});
                }else{
                    MessageBox.show('ok','错误',json.result,(result)=>{});
                }
            });
        */
    }
    render(){
        let {classlist} = this.props;
        if(classlist){
            let classItems = classlist.map((item)=>{
                return <ListItem primaryText={item.name} leftIcon={<ClassIcon />} onClick={()=>{
                    Global.openStudensList(item.clsid,item.name);
                }}/>;
            });
            return <div>
                <List>
                    {classItems}
                </List>
            </div>;    
        }else{
            return <div></div>
        }
    }
};

export default BgMgr;