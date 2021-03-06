(function(){
	
var SPEED = 1/20;
var spe = {
	group:{
		texture :{
			value : "/SPE/img/smokeparticle.png"
		}
	},
	emitter:{
		type : 1,
		maxAge : {
			value : 1
		},
		position : {
			value : [0,0,3],
			spread : [6,6,3]
		},
		acceleration : {
			value : [0,0,3],
			spread : [0,0,3]
		},
		velocity : {
			value : [0,0,2],
			spread : [0,0,2]
		},
		color : ["#a52a2a"],
		size: {
			value : 10,
			spread : 9
		},
		particleCount :300
	}
};

regItemEvent('火盆',
function(event,dt){
	switch(event){
		case 'init':
			console.log(this.name+'  登场');
			this._spe = this.sceneManager.createSpe(spe);
			this.node.add(this._spe.node());
			break;
		case 'release':
			console.log(this.name+' 退出');
			break;
		case 'update':
			if(this._spe)this._spe.update(dt);
			break;
	}
});

})();