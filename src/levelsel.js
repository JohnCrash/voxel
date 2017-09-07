/**
 * 关卡选择
 */
import React, {Component} from 'react';
import {fetchJson} from './vox/fetch';
import CircleButton from './ui/circlebutton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Paper from 'material-ui/Paper';

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

let LevelJson;
/**
 * 全局函数通过观看名称取得关卡信息
 */
global.appGetLevelInfo = function(level){
    if(!level || !LevelJson)return null;

    let m = level.match(/L(\d+)-(\d+)/);
    if(m){
        let b = Number(m[1])-1;
        let e = Number(m[2])-1;
        m = LevelJson.level[b].rang.match(/(\d+)-(\d+)/);
        if(m){
            let begin = Number(m[1]);
            let end = Number(m[2]);
            let nextName;
            if(e<end-begin){
                nextName = `L${b+1}-${e+2}`;
            }else if(LevelJson.level[b+2]){
                nextName = `L${b+2}-${1}`;
            }
            return Object.assign({current:e,
                begin,
                end,
                nextName,
                closed:LevelJson.closed},LevelJson.level[b]);
        }
    }
    return null;
}

class LevelSel extends Component{
    constructor(props){
        super(props);
        this.state={
            title:''
        };
    }
    loadJson(json){
        let stage = 0;
        appTitle( json.title );
        this.level = json.level.map((item)=>{
            let bl = [];
            let m = item.rang.match(/(\d+)-(\d+)/);
            if(m){
                let current = this.props.current || 1;
                stage++;
                for(let i=Number(m[1]);i<=Number(m[2]);i++){
                    let s,link;
                    if(i===current){
                        s = 'current';
                        link = `#level#L${stage}-${i-Number(m[1])+1}`;
                    }else if(i>=json.closed)
                        s = 'closed';
                    else if(i<current){
                        s = 'opened';
                        link = `#level#L${stage}-${i-Number(m[1])+1}`;
                    }else if(i>current)
                        s = 'unfinished';
                    if(i===Number(m[1]))
                        bl.push(<CircleButton key={i} label={i} link={link} pos='first' state={s} />);
                    else if(i===Number(m[2]))
                        bl.push(<CircleButton key={i} label={i} link={link} pos='last' state={s} />);
                    else
                        bl.push(<CircleButton key={i} label={i} link={link} state={s} />);
                }
            }
            return <Card key={item.name}>
                        <CardHeader title={item.name} titleStyle={titleStyle} subtitle={item.desc}/>
                        <CardText>{bl}</CardText>                          
                    </Card>;
        });
        this.setState({title:json.title});
    }
    load(name){
        if(LevelJson){
            this.loadJson(LevelJson);
            return;
        }
        fetchJson(`scene/${name}.index`,(json)=>{
            this.loadJson(json);
            LevelJson = json;
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
        </div>;
    }
};

export default LevelSel;