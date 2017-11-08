(function(){
	
var SPEED = 1/20;
var spe = {
	
};
regItemEvent('火盆',
function(event,dt){
	switch(event){
		case 'init':
			console.log(this.name+'  登场');
			this._spe = this.sceneManager.createSpe(spe);
			this._spe
			break;
		case 'release':
			console.log(this.name+' 退出');
			break;
		case 'update':
			break;
	}
});

})();