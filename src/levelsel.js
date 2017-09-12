/**
 * 关卡选择
 */
import React, {Component} from 'react';
import CircleButton from './ui/circlebutton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Paper from 'material-ui/Paper';
import {Global} from './global';

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
            current:0
        };
    }
    loadJson(json,cur){
        let stage = 0;
        appTitle( json.title );
        this.level = json.level.map((item)=>{
            let bl = [];
            let m = item.rang.match(/(\d+)-(\d+)/);
            if(m){
                let current = Number(cur || 1);
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
        let {index,current} = this.props;
        if(nextProps.index!=index || nextProps.current!=current){
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
        </div>;
    }
};

export default LevelSel;