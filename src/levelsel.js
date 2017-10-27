/**
 * 关卡选择
 */
import React, {Component} from 'react';
import CircleButton from './ui/circlebutton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Paper from 'material-ui/Paper';
import {Global} from './global';
import SelectChar from './selectchar';
import Unlock from './unlock';

const buttonStyle = {
    borderRadius:'18px',
    width:'36px'
};
const style = {
    marginRight: 20,
  };

const titleStyle = {
    fontSize : '18px',
    fontWeight : 'bold',
};

class LevelSel extends Component{
    constructor(props){
        super(props);
        this.state={
            title:'',
            current:0,
            openCharacterSelectDialog:false,
        };
    }
    onSelectLevel(link,p){
        if(link){
            if(Global.getCharacter()==='none'){
                //打开角色选择
                this.selectAfterLink = link;
                this.setState({openCharacterSelectDialog:true});
            }else{
                //判断关卡是否解锁，已经解锁的关卡可以直接进入
                if(p.need_unlock){
                    this.unlock.open(p,(b)=>{
                        if(b){//成功解锁
                            location.href=link;
                        }
                    });
                }else
                    location.href=link;
            }
        }
    }
    loadJson(json,cur){
        let stage = 0;
        let olv = Global.getMaxUnlockLevel();
        let lv = Global.getMaxPassLevel();
        appTitle(json.title);
        console.log(`lv=${lv} olv=${olv}`);
        this.level = json.level.map((item)=>{
            let bl = [];
            let m = item.rang.match(/(\d+)-(\d+)/);
            let unlock_gold = item.unlock?Number(item.unlock):0;
            let icon;
            let titleColor;
            if(m){
                let current = Number(cur || 1);
                stage++;
                let seg_begin = Number(m[1]);
                let seg_end = Number(m[2]);
                let islock = false;
                let isbuild = false;
                if(olv===undefined){ //没有进行任何解锁
                    if(unlock_gold){
                        islock = true;
                    }
                }else{ //已经有解锁
                    if(olv<seg_begin && unlock_gold)
                        islock = true;
                }
                isbuild = seg_begin>=json.closed;//建造中的关卡
                if(islock){
                    icon = 'scene/image/lock.png';
                    titleColor = 'gray';
                }
                if(isbuild){
                    icon = 'scene/image/level_build.png';
                    titleColor = 'gray';
                }
                for(let i=seg_begin;i<=seg_end;i++){
                    let s,link;
                    if(i===current){
                        s = 'current';
                        link = `#/level/L${stage}-${i-seg_begin+1}`;
                    }else if(i>=json.closed)
                        s = 'closed';
                    else if(i<current){
                        s = 'opened';
                        link = `#/level/L${stage}-${i-seg_begin+1}`;
                    }else if(i>current)
                        s = 'unfinished';

                    if(islock && i!==current)
                        s = 'locked';
                    if(isbuild){
                        s = 'closed';
                        link = undefined;
                    }
                    let p = {
                        unlock_gold, //要解锁的金币数量
                        seg_begin,   //本段开始关卡
                        seg_end,
                        need_unlock:islock && i===current, //需要解锁
                    };
                    if(i===seg_begin)
                        bl.push(<CircleButton key={i} label={i} onClick={this.onSelectLevel.bind(this,link,p)} pos='first' state={s} />);
                    else if(i===seg_end)
                        bl.push(<CircleButton key={i} label={i} onClick={this.onSelectLevel.bind(this,link,p)} pos='last' state={s} />);
                    else
                        bl.push(<CircleButton key={i} label={i} onClick={this.onSelectLevel.bind(this,link,p)} state={s} />);
                }
            }
            return <Card key={item.name}>
                        <CardHeader avatar={icon} title={item.name} titleColor={titleColor} titleStyle={titleStyle} subtitle={item.desc}/>
                        <CardText>{bl}</CardText>                          
                    </Card>;
        });
        this.setState({title:json.title});
    }
    load(name,current){
        Global.loadLevelJson(name,(json)=>{
            this.loadJson(json,current);
            this.setState({current});
        });
    }
    componentDidMount(){
        let {index,current} = this.props;
        this.load(index,current);
    }
    componentWillReceiveProps(nextProps){
        let {index,current,unlock} = this.props;
        if(nextProps.index!=index || nextProps.current!=current || nextProps.unlock!=unlock){
            this.load(index,nextProps.current);
        }
    }    
    render(){
        return <div>  
            <div style={{
                overflowY:'auto',
                position:'absolute',
                left :'0px',
                right :'0px',
                bottom :'0px',
                top :'64px'
            }}>
                <Paper style={{width:"90%",margin:'auto',marginTop:'20px',marginBottom:'20px',maxWidth:'520px'}}>
                {this.level}
                </Paper>
            </div>
            <SelectChar open={this.state.openCharacterSelectDialog} link={this.selectAfterLink}/>
            <Unlock ref={ref=>this.unlock=ref} />
        </div>;
    }
};

export default LevelSel;