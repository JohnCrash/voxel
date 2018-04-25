/**
 * 关卡选择
 */
import React, {Component,PureComponent} from 'react';
import CircleButton from './ui/circlebutton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Paper from 'material-ui/Paper';
import {Global} from './global';
import SelectChar from './selectchar';
import Unlock from './unlock';
import PropTypes from 'prop-types';
import LevelVideo from './levelvideo';

const titleStyle = {
    fontSize : '18px',
    fontWeight : 'bold',
};

class LevelSel extends PureComponent{
    constructor(props){
        super(props);
        this.state={
            title:'',
            current:0,
            openCharacterSelectDialog:false,
            n:-1,
            scroll:true,
            openVideo:false,
            videoSrc:'',
            videoPoster:''
        };
    }   
    onSelectLevel(link,p){
        console.info('============levelsel============');
        console.info(link);
        console.info(p);
        /**
         * 选择关卡前面有可能有一段视频,视频在该关卡第一次被点击的时候播放，其他时候不播放
         */
        if(this._videoEndtoSelectLevelLink){
            console.log('this._videoEndtoSelectLevelLink : '+this._videoEndtoSelectLevelLink);
            //从onVideoEnded过来的调用
            this._videoEndtoSelectLevelLink = null;
            this._videoEndtoSelectLevelP = null;
        }else{
            console.log('do open level video...');
            let info = Global.appGetLevelInfo(link);
            let levelJson = Global.levelJson();
            if(info && levelJson){
                let db = levelJson.movie[info.next-1];
                //确保视频只放一次
                if(db && db.video && !localStorage['lvv'+(info.next-1)]){
                    localStorage['lvv'+(info.next-1)] = true;
                    this.openVideo(db);
                    this._videoEndtoSelectLevelLink = link;
                    this._videoEndtoSelectLevelP = p;
                    return;    
                }
            }            
        }

        if(link){
            console.info('Global.getCharacter() = '+Global.getCharacter());
            if(Global.getCharacter()==='none'){
                //打开角色选择
                console.info('Select Character');
                this.selectAfterLink = link;
                this.setState({openCharacterSelectDialog:false},()=>{
                    this.setState({openCharacterSelectDialog:true});
                });
            }else{
                /**
                 * FIXBUG : iOS 不允许自动播放声音
                 */
                if(Global.getPlatfrom()==='ios'){
                    Global.playMusic('scene/audio/aaa.mp3');
                }
                //判断关卡是否解锁，已经解锁的关卡可以直接进入
                if(p.need_unlock){
                    this.unlock.open(p,(b)=>{
                        if(b){//成功解锁
                            location.href=link;//eslint-disable-line
                        }
                    });
                }else
                    location.href=link;//eslint-disable-line
            }
        }
    }
    onVideoEnded = (b)=>{
        console.log('onVideoEnded pop');
        Global.pop();
        this.setState({openVideo:false});
        if(this._videoEndtoSelectLevelLink){
            this.onSelectLevel(this._videoEndtoSelectLevelLink,this._videoEndtoSelectLevelP);
        }
    }
    openVideo(db){
        console.log('openVideo:'+db);
        Global.push(()=>{
            console.log('release video');
            this.onVideoEnded();
        });
        if(window.innerWidth<window.innerHeight){
            console.log('===> video portrait');
            this.setState({openVideo:true,videoSrc:db.video,videoPoster:db.poster});
        }            
        else{
            console.log('===> video landscape');
            this.setState({openVideo:true,videoSrc:db.video2,videoPoster:db.poster2});
        }            
    }    
    /**
     * db , 是{lv,video,poster}
     */
    onSelectMovie(db,link,p,s){
        console.info('============moviesel============');
        console.info(db);
        try{
            if(s==='opened' || s==='current'){
                //视频播放完了如果是第一次可以开始关卡
                console.log('onSelectMovie : '+link);
                let info = Global.appGetLevelInfo(link);
                if(info){
                    //确保视频只放一次
                    if(!localStorage['lvv'+(info.next-1)]){
                        localStorage['lvv'+(info.next-1)] = true;
                        this._videoEndtoSelectLevelLink = link;
                        this._videoEndtoSelectLevelP = p;
                    }
                }
                this.openVideo(db);
            }
        }catch(e){
            console.log(e);
        }        
    }
    loadJson(json,cur){
        let stage = 0;
        let olv = Global.getMaxUnlockLevel();
        let lv = Global.getMaxPassLevel();
        Global.appTitle(json.title);
        console.log(`lv=${lv} olv=${olv}`);
        /**
         * props.other 是一个数组，表示同班的其他进度
         * [ uid | UserName | lv | lastcommit ]
         * 重新映射为以lv为key的对象
         * props.lvs 是一个数组
         * {
         *  rank ,你的排名
         *  lv , 关卡数
         *  blocks ,你的最好块
         *  best ,本关最佳块数
         * }
         */
        let lvs = this.props.lvs?this.props.lvs:[];
        let others = {};
        let myuid = Global.getUID();
        if(this.props && this.props.other){
            for(let o of this.props.other){
                //这里最近的
                if(!others[o.lv] || (others[o.lv] && others[o.lv].lvdate > o.lvdate && others[o.lv].uid!=myuid)){
                    others[o.lv] = o;
                }
                if(o.uid===myuid)
                    others[o.lv] = o;
            }
        }
        function lvtoid(lv){
            return others[lv];
        }
        let curSeg;
        this.buttons = [];
        function getMoive(i){
            if(json && json.movie)return json.movie[i];
        }
        //一个便捷表视频和link,p的映射
        this._lvMapLinkP = {};

        this.level = json.level.map((item)=>{
            let bl = [];
            let m = item.rang.match(/(\d+)-(\d+)/);
            let unlock_gold = item.unlock?Number(item.unlock):0;
            let unlock_crown = item.unlock_crown?Number(item.unlock_crown):0;
            let icon;
            let titleColor;
            let curSeg = false;
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
                    if(olv<=seg_begin && unlock_gold)
                        islock = true;
                }
                isbuild = seg_begin>=json.closed;//建造中的关卡
                if(islock){
                    icon = Global.getCDNURL('scene/image/lock.png');
                    titleColor = 'gray';
                }
                if(isbuild){
                    icon = Global.getCDNURL('scene/image/level_build.png');
                    titleColor = 'gray';
                }
                for(let i=seg_begin;i<=seg_end;i++){
                    let s,link;
                    if(i===current){
                        curSeg = true;
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
                        unlock_crown,
                        seg_begin,   //本段开始关卡
                        seg_end,
                        need_unlock:islock && i===current, //需要解锁
                    };
                    let db = getMoive(i);
                    if(i===seg_begin){
                        let poss = 'first';
                        if(db && db.video){
                            poss = undefined;
                            this._lvMapLinkP[i] = {link,p};
                            bl.push(<CircleButton key={'m'+i}
                                pos='first'
                                state={s}
                                ismovie={true} 
                                onClick={this.onSelectMovie.bind(this,db,link,p,s)} />);
                        }
                        bl.push(<CircleButton key={i} label={i} bob={lvtoid(i-1)} rank={lvs[i]?lvs[i].rank:0} 
                        ref={(r)=>{this.buttons[i]=r}}
                        onClick={this.onSelectLevel.bind(this,link,p)} 
                        pos={poss} 
                        state={s} />);
                    }else if(i===seg_end){
                        if(db && db.video){
                            this._lvMapLinkP[i] = {link,p};
                            bl.push(<CircleButton key={'m'+i}
                                state={s}
                                ismovie={true} 
                                onClick={this.onSelectMovie.bind(this,db,link,p,s)} />);
                        }                        
                        bl.push(<CircleButton key={i} label={i} bob={lvtoid(i-1)} rank={lvs[i]?lvs[i].rank:0}
                        ref={(r)=>{this.buttons[i]=r}}
                        onClick={this.onSelectLevel.bind(this,link,p)} 
                        pos='last'
                        state={s} />);
                    }else{
                        if(db && db.video){
                            this._lvMapLinkP[i] = {link,p};
                            bl.push(<CircleButton key={'m'+i}
                                state={s}
                                ismovie={true} 
                                onClick={this.onSelectMovie.bind(this,db,link,p,s)} />);
                        }                         
                        bl.push(<CircleButton key={i} label={i} bob={lvtoid(i-1)} rank={lvs[i]?lvs[i].rank:0} 
                        ref={(r)=>{this.buttons[i]=r}}
                        onClick={this.onSelectLevel.bind(this,link,p)} 
                        state={s} />);
                    }
                }
            }
            return <Card key={item.name} onLoad={curSeg?(event)=>{
                //event.target 是<img />,向上找4层父节点
                let p = event.target;
                for(let i =0;i<4;i++){
                    if(p)p = p.parentNode;
                }
                if(p)p.scrollIntoViewIfNeeded();}:undefined}>
                        <CardHeader avatar={icon} title={item.name} titleColor={titleColor} titleStyle={titleStyle} subtitle={item.desc}/>
                        <CardMedia>
                            {item&&item.preview?<img src={Global.getCDNURL(item.preview)} alt="" />:undefined}
                        </CardMedia>
                        <CardText>{bl}</CardText>                          
                    </Card>;
        });
        this.setState({title:json.title,n:this.level.length});
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
        this._clslvlistener = (t)=>{
            let {index,current} = this.props;
            this.load(index,current);
            this.forceUpdate();
        };
        Global.on('clslv',this._clslvlistener);
    }
    componentWillUnmount(){
        Global.removeListener('clslv',this._clslvlistener);
    }
    componentWillReceiveProps(nextProps){
        let {index,current,unlock} = this.props;
        if(nextProps.index!=index || nextProps.current!=current || nextProps.unlock!=unlock){
            this.load(index,nextProps.current);
        }
        if(nextProps.lvideo !== this._lvideo && nextProps.lvideo){
            //先播放视频在进行关卡,lvideo表示要播放的视频的关卡。
            this._lvideo = nextProps.lvideo;
            let levelJson = Global.levelJson();
            if(levelJson && levelJson.movie && this._lvMapLinkP){
                let db = levelJson.movie[nextProps.lvideo];
                let m = this._lvMapLinkP[nextProps.lvideo];
                if(db && m){
                    //必须导入到下一关
                    this._videoEndtoSelectLevelLink = m.link;
                    this._videoEndtoSelectLevelP = m.p;
                    this.onSelectMovie(db,m.link,m.p,'opened');
                }
            }
        }
    }
    /**
     * 使用context传递style信息
     */
    getChildContext(){
        let r = Global.getPlatfrom()==="windows"?48:Math.floor((window.innerWidth*0.9-32)/10-12);
        if(r < 36)r = 36;
        return {
            circleRadius : r
        }
    }
    /**
     * 改变按钮的状态为s ,用来产生一个解锁动画
     */
    changeButtonState(i,os,s){
        if(this.buttons && this.buttons[i])this.buttons[i].changeState(os,s);
    }
    /**
     * 打开和关闭滚动
     */
    enableScroll(b){
        /*
        if(!this.disableScrollFunc)
            this.disableScrollFunc = function(event){
                event.preventDefault();
            };

        if(this.scrollNode){
            if(b){
                console.log('ENABLE');
                this.scrollNode.removeEventListener('touchstart',this.disableScrollFunc);
            }else{
                console.log('DISABLE');
                this.scrollNode.addEventListener('touchstart',this.disableScrollFunc,true);
            }
        }
        */
        this.setState({scroll:b});
    }
    render(){
        let circleRadius = this.getChildContext().circleRadius;
        let maxWidth = (circleRadius+12)*10+32+'px';
        //                overflowY:'auto',
        let {scroll,openVideo,videoSrc,videoPoster} = this.state;
        return <div>  
            <div              
            ref={(r)=>{this.scrollNode = r;}}
            style={{
                overflowY:scroll?'auto':'hidden',
                position:scroll?'absolute':'fixed',
                left :'0px',
                right :'0px',
                bottom :'0px',
                top :'64px',
            }}>
                <Paper style={{width:"90%",margin:'auto',marginTop:'20px',marginBottom:'20px',maxWidth}}>
                {this.renderLevel}
                </Paper>
            </div>
            {!Global.getMainState()?<SelectChar open={this.state.openCharacterSelectDialog} link={this.selectAfterLink}/>:undefined}
            <Unlock ref={ref=>this.unlock=ref} changeButtonState={this.changeButtonState.bind(this)}/>
            <LevelVideo open={openVideo} src={videoSrc} poster={videoPoster} onEnded={this.onVideoEnded.bind(this)}/>
        </div>;
    }
    componentWillUpdate(nextProps, nextState){
        
    }
    componentDidUpdate(prevProps, prevState){
        if(this.state.n >= 0 && this.level){
            this.renderLevel = this.level.slice(0,this.level.length-this.state.n);
            setTimeout(()=>{
                this.setState({n:this.state.n-1});
            },1);
        }
    }
};

LevelSel.defaultProps = {
    current : 0,
    other : []
};

LevelSel.propTypes = {
    index : PropTypes.string,
    current : PropTypes.number,
    other : PropTypes.array,
    unlock : PropTypes.number,
};

LevelSel.childContextTypes = {
    circleRadius : PropTypes.number 
};

export default LevelSel;