(function(){

regItemEvent('石块',
function(event,dt){
	switch(event){
		case 'collision':
			//this.playSound('scene/audio/effect/正确的宝石声音.ogg');
			if(this.currentAction!=='forward'){
				var item = dt;
				if(item.obstruct){
					item.obstruct(this);
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
			if(this.currentAction === 'forward'){
				var t = this.forwardT;
				if(t>=1){
					t = 1;
					this.currentAction = '';
				}
				this.position.x = this.forwardEnd.x*t + this.forwardBegin.x*(1-t);
				this.position.y = this.forwardEnd.y*t + this.forwardBegin.y*(1-t);
				this.forwardT += this.speed*dt/1000;				
			}
			break;
	}
});

})();