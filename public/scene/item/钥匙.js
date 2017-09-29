(function(){
	
var SPEED = Math.PI/1000;

regItemEvent('钥匙',
function(event,dt){
	switch(event){
		case 'collision':
			{
				this.playSound('scene/audio/effect/正确的宝石声音.ogg');
				this.removeSelf();
				//赋予被碰撞物一个函数
				var item  = dt;
				item.usekey = function(box){
					box.doAction('open');
					setTimeout(function(){
						box.blocklyEvent('MissionCompleted')},
						500);
				}
			}
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