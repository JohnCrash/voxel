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
			value : [0,0,20.5],
			spread : [2,2,2]
		},
		acceleration : {
			value : [0,0,2],
			spread : [2,2,2]
		},
		velocity : {
			value : [0,0,2],
			spread : [2,2,2]
		},
		color : ["#FF4500"], // a52a2a
		size: {
			value : 7,
			spread : 6
		},
		particleCount :150
	}
};

regItemEvent('数字障碍',
function(event,dt){
	switch(event){
		case 'collision':
			//this.playSound('scene/audio/effect/正确的宝石声音.mp3');
			{				
				var item = dt;
				if(item.obstruct && this.currentAction !== 'unlock_numbox'){
					item.obstruct(this);
				}
			}
			break;
		case 'init':
			console.log(this.name+'  登场');
			//
			this._spe = this.sceneManager.createSpe(spe);
			this.node.add(this._spe.node());
			//
			if(this.json)
				this.num = this.json.num || 15;
			else
				this.num = 15;
			this._num = this.num;
			this.doAction('num_'+this._num);
			this.update_box_num = function(){
				this._num--;
				this.doAction('num_'+this._num);
				var _this = this;
				if(this._num<=0){
					setTimeout(function(){
						_this.removeSelf();
					},300);
				}
				return this._num;
			}
			
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