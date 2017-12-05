(function(){
	
var SPEED = 1/2;
var DOWN = 0.9;

regItemEvent('地板开关',
function(event,dt){
	switch(event){
		case 'collision':
			//this.playSound('scene/audio/effect/正确的宝石声音.mp3');
			if(this._t!=1 && this.currentAction !== 'drop'){
				//下沉自己打开平板
				this.currentAction = 'drop';
				this._t = 0;
				this.idleAcc = 0;
			}
			break;
		case 'construct':
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
			console.log('? 登场 ?');
			this._t = 0;
			this._oldz = this.position.z;
			this.currentAction = '';
			this.collisionWithGround = false;//不与地面发生碰撞，仅仅物体彼此发生碰撞
			this.turnFlat = function(b){
				var i;
				for(i=0;i<this.sceneManager.items.length;i++){
					var item = this.sceneManager.items[i];
					if(item && item.typeName === '地板' && this.flatColor===item.flatColor){
						item.turnon(b);
					}
				}
			};
			console.log(this.name+'  登场');
			break;
		case 'release':
			console.log(this.name+' 退出');
			break;
		case 'update':
			if(this.currentAction === 'drop'){
				this._t += SPEED * dt;
				if(this._t>1){
					this._t=1;
					this.currentAction = '';
					//打开平板
					this.turnFlat(true);
				}
				this.position.z = this._oldz - DOWN*this._t;
			}else if(this.currentAction === 'floating'){
				this._t += SPEED * dt;
				if(this._t>1){
					this._t=1;
					this.currentAction = '';
					//关闭平板
					this.turnFlat(false);
				}
				this.position.z = this._oldz + (DOWN-1)*this._t;
			}else{
				//idle
				this.idleAcc += dt;
				if(this.idleAcc>100){
					this.idleAcc = 0;
					this._t = 0;
					this.currentAction = 'floating';
				}	
			}
			break;
	}
});

})();