(function(){

var SPEED = Math.PI/1000;
regItemEvent('宝石',
function(event,dt){
	switch(event){
		case 'collision':
			this.playSound('scene/audio/effect/比赛成绩金光闪闪.mp3');
			this.removeSelf();
			var b = false;
			var i;
			for(i = 0;i<this.sceneManager.items.length;i++){
				if(this.sceneManager.items[i].typeName==='宝石')
					b = true;
			}
			if(!b)this.blocklyEvent('MissionCompleted');
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