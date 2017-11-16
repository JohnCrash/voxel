(function(){
	
var SPEED = 1/20;

regItemEvent('水晶',
function(event,dt){
	switch(event){
		case 'collision':
			//this.playSound('scene/audio/effect/正确的宝石声音.mp3');
			{
				var item = dt;
				if(item.obstruct && this.currentAction !== 'unlock'){
					item.obstruct(this);
				}
			}
			break;
		case 'init':
			console.log(this.name+'  登场');
			this.unlock = function(){
				this.currentAction = 'unlock';
				this.collision = false; 
				this.gravity = false;				
			}
			break;
		case 'release':
			console.log(this.name+' 退出');
			break;
		case 'update':
			if(this.currentAction === 'unlock'){
				this.position.z -= SPEED * dt;
				if(this.position.z < -50){
					this.removeSelf();
				}
			}
			break;
	}
});

})();