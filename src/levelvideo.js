import React, {Component} from 'react';
//import { DefaultPlayer as Video } from 'react-html5video';
//import 'react-html5video/dist/styles.css';
//import ReactPlayer from 'react-player'

class LevelVideo extends Component{
    onEnded=(event)=>{
        console.log('===>onEnded');
        if(this.props.onEnded){
            this.props.onEnded(true);
        }
    }
    onCanPlay=(event)=>{
        console.log('===>onCanPlay');
        if(this._video)this._video.play();
    }
    onError=(event)=>{
        console.log('===>onError');
        if(this.props.onEnded){
            this.props.onEnded(false);
        }
    }
    onPlaying=(event)=>{
        console.log('===>onPlaying');
    }
    onPause=(event)=>{
        console.log('===>onPause');
        if(this.props.onEnded){
            this.props.onEnded(true);
        }        
    }
    render(){
        //return <ReactPlayer url='media/test.mp4' playing />
        //controls="controls"
        //poster={poster}
        let {open,src,poster} = this.props;
        return <div style={{position:"fixed",
                display:open?"block":"none",
                zIndex:9999,
                top:0,
                width:"100%",
                height:"100%",
                backgroundColor:"black"}}>
            {open?<video autoPlay
                poster={poster}
                width="100%" height="100%" 
                src={src}
                ref={ref=>this._video=ref}
                loop={false}
                onError={this.onError.bind(this)}
                onCanPlay={this.onCanPlay.bind(this)}
                onEnded={this.onEnded.bind(this)}
                onPause={this.onPause.bind(this)}
                onPlaying={this.onPlaying.bind(this)}>
                Your browser does not support the video tag.
            </video>:undefined}
        </div>;
        /*
        return (
            <Video autoPlay loop muted
                id = 'video'
                width="100%"
                height="100%"
                controls={['PlayPause', 'Seek', 'Time', 'Volume']}
                poster="http://sourceposter.jpg"
                onCanPlayThrough={() => {
                    // Do stuff
                }}>
                <source src="media/test.mp4" type="video/mp4" />
            </Video>
        ); */  
    }
}

export default LevelVideo;