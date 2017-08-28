(function(){
var SPEED = 1/20;
regItemEvent('栅栏',
function(event,dt){
	switch(event){
		case 'collision':
			//this.playSound('scene/audio/effect/正确的宝石声音.ogg');
			{
				let item = dt;
				if(item.obstruct){
					item.obstruct(this);
				}
			}
			break;		
		case 'init':
			console.log(`${this.name} 登场`);
			this.unlock = function(){
				this.currentAction = 'unlock';
			}
			break;
		case 'release':
			console.log(`${this.name} 退出`);
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