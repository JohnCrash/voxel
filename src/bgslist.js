/**
 * 后台管理学生关卡完成情况列表
 */
import React, {Component} from 'react';
import FlatButton from 'material-ui/FlatButton';
import {MessageBox} from './ui/MessageBox';
import {Global} from './global';
import MarkdownElement from './ui/MarkdownElement';
import {ljshell} from './ljshell';
import {List, ListItem} from 'material-ui/List';
import StudentIcon from 'material-ui/svg-icons/action/face';
import Avatar from 'material-ui/Avatar';

const style = {
    display:'flex',
    flexDirection:'column',
    alignItems:'center'
};

function sqlDateString(d){
    return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
}

class BgSlist extends Component{
    constructor(props){
        super(props);
    }
    render(){
        let {studentlist}=this.props;
        if(studentlist){
            //uid,UserName,lastcommit,olv
            //toLocaleString
            let studentItems = studentlist.map((item)=>{
                let localdate = new Date(item.lastcommit);
                let userlogo = `http://image-static.lejiaolexue.com/userlogo/${item.uid}_99.jpg?p=${Global.getRandom()}`;
                return <ListItem primaryText={item.UserName} 
                secondaryText={`更新时间: ${sqlDateString(localdate)}`} 
                leftAvatar={<Avatar src={userlogo} />} 
                rightAvatar={<div style={style}><span style={{color:'cornflowerblue',fontSize:'13px'}}>已完成</span><span style={{fontSize:'20px'}}>{item.lv}关</span></div>}
                onClick={()=>{
                    //查看一个用户关卡情况
                    Global.openStudentLevel(item.uid,item.UserName,item.cls);
                }}/>;
            });
            return <div>
            <List>
                {studentItems}
            </List>
        </div>;   
        }else{
            return <div></div>
        }
    }
};

export default BgSlist;