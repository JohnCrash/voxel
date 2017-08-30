(function(){
	
var SPEED = 1/10;
var DOWN = 0.9;

regItemEvent('地板开关',
function(event,dt){
	switch(event){
		case 'collision':
			//this.playSound('scene/audio/effect/正确的宝石声音.ogg');
			if(this._t!=1 && this.currentAction !== 'drop'){
				//下沉自己打开平板
				this.currentAction = 'drop';
				this._t = 0;
				this.idleAcc = 0;
				console.log('collision drop');
			}
			break;
		case 'init':
			this._t = 0;
			this._oldz = this.position.z;
			this.currentAction = '';
			this.collisionWithGround = false;//不与地面发生碰撞，仅仅物体彼此发生碰撞
			this.turnFlat = function(b){
				var i;
				for(i=0;i<this.sceneManager.items.length;i++){
					var item = this.sceneManager.items[i];
					if(item && item.typeName === '地板'){
						item.turnon(b);
					}
				}
			};
			console.log(`${this.name} 登场`);
			break;
		case 'release':
			console.log(`${this.name} 退出`);
			break;
		case 'update':
			if(this.currentAction === 'drop'){
				this._t += SPEED * dt;
				if(this._t>1){
					this._t=1;
					this.currentAction = '';
					console.log('flat open');
					//打开平板
					this.turnFlat(true);
				}
				console.log(`drop ${this._t}`);
				this.position.z = this._oldz - DOWN*this._t;
			}else if(this.currentAction === 'floating'){
				this._t += SPEED * dt;
				if(this._t>1){
					this._t=1;
					this.currentAction = '';
					console.log('flat close');
					//关闭平板
					this.turnFlat(false);
				}
				console.log(`floating ${this._t}`);
				this.position.z = this._oldz + DOWN*this._t;
			}else{
				//idle
				this.idleAcc += dt;
				if(this.idleAcc>6000){
					this.idleAcc = 0;
					this._t = 0;
					this.currentAction = 'floating';
					console.log('flat floating');
				}	
			}
			break;
	}
});

})();