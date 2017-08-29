(function(){
	
var SPEED = 1;
var STEP = 17-2.5; 

regItemEvent('地板',
function(event,dt){
	switch(event){
		case 'collision':
			//this.playSound('scene/audio/effect/正确的宝石声音.ogg');
			break;
		case 'init':
			console.log(`${this.name} 登场`);
			this._onoff = false;
			this._offset = 0;
			this.turnon = function(b){
				let d;
				if(b){
					this.currentAction = 'turn_on';
					d = STEP;				
				}else{
					this.currentAction = 'turn_off';
					d = -STEP;
				}
				this.forwardBegin = {x:this.position.x,y:this.position.y};
				this.forwardEnd = {
					x:this.position.x+Math.cos(this.rotation.z-Math.PI/2)*d,
					y:this.position.y+Math.sin(this.rotation.z-Math.PI/2)*d
				};									
				this.forwardT = 0;
				this.speed = SPEED;
				this._onoff = !!b;
			}
			break;
		case 'release':
			console.log(`${this.name} 退出`);
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
			}
			break;
	}
});

})();