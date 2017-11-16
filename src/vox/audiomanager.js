/*global THREE*/
class _AudioManager{
    constructor(){
        this.audios = {};
        this.loader = new THREE.AudioLoader();
    }
    reset(){
        this.audios = {};
    }
    load(file,cb){
        let s = this.audios[file];
        if(s && s.state==='ready'){
            cb(false,s.buffer);
        }else if(s && s.state==='loading'){
            s.cbs.push(cb);
        }else{
            s = this.audios[file] = {state:'loading',cbs:[cb]};
            this.loader.load(file,(buffer)=>{
                s.buffer = buffer;
                s.state = 'ready';
                for(let cbc of s.cbs){
                    cbc(false,buffer);
                }
                s.cbs = undefined;
            },(xhr)=>{ //progress
            },(xhr)=>{
                s.state = 'error';
                for(let cbc of s.cbs){
                    cbc(true);
                }
                s.cbs = undefined;
            });
        }        
    }
};

export let AudioManager = new _AudioManager();
