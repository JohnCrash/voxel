(function(){
	
regItemEvent('水晶',
function(event,dt){
	switch(event){
		case 'collision':
			this.playSound('scene/audio/effect/正确的宝石声音.ogg');
			this.removeSelf();
			break;		
		case 'init':
			console.log(`${this.name} 登场`);
			break;
		case 'release':
			console.log(`${this.name} 退出`);
			break;
		case 'update':
			break;
	}
});

})();