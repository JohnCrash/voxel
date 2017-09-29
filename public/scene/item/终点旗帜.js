(function(){
	
regItemEvent('终点旗帜',
function(event,dt){
	switch(event){
		case 'collision':
			this.blocklyEvent('MissionCompleted');
			this.playSound('scene/audio/effect/成功.ogg');
			this.removeSelf();
			break;			
		case 'init':
			console.log(this.name+' 登场');
			break;
		case 'release':
			console.log(this.name+' 退出');
			break;
		case 'update':
			break;
	}
});

})();