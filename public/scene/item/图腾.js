(function(){

regItemEvent('图腾',
function(event,dt){
	switch(event){
		case 'init':
			console.log(this.name+'  登场');
			break;
		case 'release':
			console.log(this.name+' 退出');
			break;
	}
});

})();