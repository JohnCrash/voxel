(function(){
	
var SPEED = 32;
var STEP = 17-2; 

regItemEvent('地板',
function(event,dt){
	switch(event){
		case 'collision':
			//this.playSound('scene/audio/effect/正确的宝石声音.mp3');
			break;
		case 'construct':
			this.ground = true;
			this.flatColor = 'green'; //default color
			this.toJsonEx = function(json){
				json.flatColor = this.flatColor;
			}
			this.loadEx = function(json){
				this.flatColor = json.flatColor || 'green';
				this.doAction(this.flatColor);
			}
			this.editorUI = function(ui,itemUI,item){
				Object.defineProperty(itemUI,"颜色",{
					get:function(){
						return item.flatColor;
						},
					set:function(v){
						item.flatColor = v;
						item.doAction(v);
						}});
				ui.add(itemUI,'颜色',['green','yellow','red','purple','blue','brown']);
			}		
			break;
		case 'init':
			console.log(this.name+'  登场');
			this._onoff = false;
			this.forwardT = 1;
			this._forwardPt = {x:this.position.x,y:this.position.y};
			this._endPt = this.forwardEnd = {
					x:this.position.x+Math.cos(this.rotation.z-Math.PI/2)*STEP,
					y:this.position.y+Math.sin(this.rotation.z-Math.PI/2)*STEP
				};
			this.turnon = function(b){
				if(this._onoff == !!b || this.forwardT!==1)return;
				var d;
				this.forwardBegin = {x:this.position.x,y:this.position.y};
				if(b){
					this.currentAction = 'turn_on';
					d = STEP;
					this.forwardEnd = this._endPt;
				}else{
					this.currentAction = 'turn_off';
					d = -STEP;
					this.forwardEnd = this._forwardPt;
				}								
				this.forwardT = 0;
				this.speed = SPEED;
				this._onoff = !!b;
			}
			break;
		case 'release':
			console.log(this.name+' 退出');
			break;
		case 'update':
			if(this.currentAction === 'turn_on'||this.currentAction === 'turn_off'){
				var t = this.forwardT;
				if(t>=1){
					t = 1;
					this.currentAction = '';
					//this.blocklyContinue('turn on off');
				}					
				this.position.x = this.forwardEnd.x*t + this.forwardBegin.x*(1-t);
				this.position.y = this.forwardEnd.y*t + this.forwardBegin.y*(1-t);
				this.forwardT += this.speed*dt/1000;
				if(this.forwardT>1)this.forwardT=1;
			}
			break;
	}
});

})();