(function(){
	
var SPEED = Math.PI/1000;
regItemEvent('金币',
function(event,dt){
	switch(event){
		case 'collision':
			this.playSound('scene/audio/effect/比赛成绩金光闪闪.mp3');
			this.removeSelf();
			break;
		case 'init':
			console.log(this.name+'  登场');
			break;
		case 'release':
			console.log(this.name+' 退出');
			break;
		case 'update':
			this.rotation.z += SPEED*dt;
			break;
	}
});

})();