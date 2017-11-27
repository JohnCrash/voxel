(function(){

var STEP = 18;
var SPEED = 1;
var JUMP_SPEED = 47;
var JUMP_STEP = 1;
var characters = [];

var lastArrowHelper = null;
/**
 * 加入一个方向
 */
function AddArrowHelper(sceneManager,dir,origin,length, hex){
	var arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
	sceneManager.game.scene.add(arrowHelper);
	return arrowHelper;
}

function AddCrossHelper(sceneManager,origin,length){
	var arrowHelper = new THREE.ArrowHelper( new THREE.Vector3(1,0,0), origin, length, 0xff0000 );
	sceneManager.game.scene.add(arrowHelper);
	arrowHelper = new THREE.ArrowHelper( new THREE.Vector3(0,1,0), origin, length, 0x00ff00 );
	sceneManager.game.scene.add(arrowHelper);
	arrowHelper = new THREE.ArrowHelper( new THREE.Vector3(0,0,1), origin, length, 0x0000ff );
	sceneManager.game.scene.add(arrowHelper);	
	return arrowHelper;
}

function RemoveArrowHelper(sceneManager,arrowHelper){
	if(arrowHelper)
		sceneManager.game.scene.remove(arrowHelper);
}

function initItemBlockly(_this){
	if(typeof(Blockly)==='undefined')return;
	_this.forwardAngle = _this.rotation.z;
	
	characters.push(_this);
	function appendCharacterDropdown(c){
		if(characters.length>1){
			var op = [];
			for(var i=0;i<characters.length;i++){
				var name = "";
				if(characters[i].name==='男孩')
					name = Blockly.Msg.BOY;
				else if(characters[i].name==='女孩')
					name = Blockly.Msg.GIRL;
				op.push([name,characters[i].name]);
			}
			c.appendField(new Blockly.FieldDropdown(op),"CHARCTER");
		}
		return c;
	}
	function getItemByName(name){
		if(name==='null'){
			return characters[0];
		}
		for(var i=0;i<characters.length;i++){
			if(name === characters[i].name)
				return characters[i];
		}
		return null;
	}
	function ItemAction(item,action){
		//console.log('ACTION : ${item.name} ${action}');
		if(item.liftItem){
			//举起的动作
			switch(action){
				case 'walk':action = 'lift_up_item_walk';break;
				case 'idle':action = 'lift_up_item_idle';break;
				case 'jump':action = 'lift_up_item_jump';break;
			}
		}
		item.doAction(action);
	}
	//开始
	Blockly.Blocks['when_start'] = {
    init: function () {
        Blockly.BlockSvg.START_HAT = true;
        this.setColour(1);
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_CENTRE)
            .appendField(Blockly.Msg.WHEN_START);
        this.setNextStatement(true, "null");
        this.setTooltip('');
		}
	};

	Blockly.JavaScript['when_start'] = function (block) {
		var code = "";
		return code;
	};																																
	//前进
	Blockly.Blocks['forward'] = {
    init: function () {
        this.setColour(2);
        appendCharacterDropdown(this.appendValueInput("STEP")
            .setCheck("Number"))
            .appendField(Blockly.Msg.FORWARD);
		
        this.appendDummyInput()
            .appendField(Blockly.Msg.STEP);
        this.setInputsInline(true);
        this.setPreviousStatement(true, "null");
        this.setNextStatement(true, "null");
        this.setTooltip('');
        this.contextMenu = false;
		}
	};
	
	Blockly.JavaScript['forward'] = function (block) {
		var charcter_name = block.getFieldValue('CHARCTER');
		var number_step = Blockly.JavaScript.valueToCode(block, 'STEP', Blockly.JavaScript.ORDER_ATOMIC);
		var code = 'forward("'+charcter_name+'",'+number_step+');\n';
		return code;
	};
	
	_this.obstruct = function(i){
		if(!this._isobstruct){
			this._isobstruct = true;
			this._obstructItem = i;
			if(this.currentAction==='forward'){
				this.blocklyContinue('collision obstruct');
				this.currentAction='idle';
			}else{
				this.currentAction = 'jumpwall';
			}
		}
	}
	function eqAngle(a1,a2){
		var a = Math.abs((a2-a1)/(2*Math.PI));
		var b = Math.floor(a);
		return Math.abs(a-b)<0.01;
	}
	function calcD(item){
		var d = Math.sqrt((item.forwardBegin.x-item.position.x)*(item.forwardBegin.x-item.position.x)+(item.forwardBegin.y-item.position.y)*(item.forwardBegin.y-item.position.y));
		return d - Math.floor(d/STEP)*STEP;
	}
	_this.injectBlocklyFunction('forward',function(name,step){
		console.log('forward');
		var item = getItemByName(name);
		if(!item||!step)return;
		if((item._isobstruct||item.resultAction==='break') && !eqAngle(item.rotation.z-(step>0?Math.PI:0),item.forwardAngle)){
			item.blocklyStop();
			ItemAction(item,'walk');
			setTimeout(function(){
				ItemAction(item,'idle');
				item.blocklyContinue('forward');
			},300);
			return;
		}

		item.blocklyStop();
		item.currentAction = 'forward';
		
		if(item.forwardT!==undefined && item.forwardT!=1){
			var d;
			if(step>0)
				d = (step-1)*STEP + calcD(item);
			else if(step<0){
				d = (step+1)*STEP - calcD(item);
			}else
				d = 0;
			item.forwardBegin = {x:item.position.x,y:item.position.y};
			item.forwardEnd = {
				x:item.position.x+Math.cos(item.rotation.z-Math.PI/2)*d,
				y:item.position.y+Math.sin(item.rotation.z-Math.PI/2)*d
			};
		}else{
			item.forwardBegin = {x:item.position.x,y:item.position.y};
			item.forwardAngle = item.rotation.z;
			var d = step*STEP;
			item.forwardEnd = {
				x:item.position.x+Math.cos(item.rotation.z-Math.PI/2)*d,
				y:item.position.y+Math.sin(item.rotation.z-Math.PI/2)*d
			};
		}
		
		item.forwardT = 0;
		if(step>0)
			item.speed = SPEED/step;
		else
			item.speed = SPEED/(2*Math.abs(step));
		
		ItemAction(item,'walk');
	});

	//左转
	Blockly.Blocks['turn_left'] = {
	  init: function() {
		this.setColour(4);
		appendCharacterDropdown(this.appendDummyInput())
			.appendField(Blockly.Msg.TURN_LEFT)
		this.setPreviousStatement(true, "null");
		this.setNextStatement(true, "null");
		this.setTooltip('');
	  }
	};

	Blockly.JavaScript['turn_left'] = function(block) {
	  var charcter_name = block.getFieldValue('CHARCTER');
	  var code = 'turn_left("'+charcter_name+'");\n';
	  return code;
	};
	
	_this.injectBlocklyFunction('turn_left',function(name){
		var item = getItemByName(name);
		if(!item)return;
		item.blocklyStop('turn_left');
		item.currentAction = 'empty';
		item.rotation.z += Math.PI/2;
		if(item.liftItem)item.liftItem.rotation.z += Math.PI/2;
		ItemAction(item,'walk');
		setTimeout(function(){
			item.currentAction = '';
			item.idleAcc = 0;
			item.blocklyContinue('turn_left');
		},100);
	});
	//右转
	Blockly.Blocks['turn_right'] = {
	  init: function() {
		this.setColour(5);
		appendCharacterDropdown(this.appendDummyInput())
			.appendField(Blockly.Msg.TURN_RIGHT)
		this.setPreviousStatement(true, "null");
		this.setNextStatement(true, "null");
		this.setTooltip('');
	  }
	};

	Blockly.JavaScript['turn_right'] = function(block) {
	  var charcter_name = block.getFieldValue('CHARCTER');
	  var code = 'turn_right("'+charcter_name+'");\n';
	  return code;
	};
	
	_this.injectBlocklyFunction('turn_right',function(name){
		var item = getItemByName(name);
		if(!item)return;
		item.blocklyStop('turn_right');
		item.currentAction = 'empty';
		item.rotation.z -= Math.PI/2;
		if(item.liftItem)item.liftItem.rotation.z -= Math.PI/2;
		ItemAction(item,'walk');
		setTimeout(function(){
			item.currentAction = '';
			item.idleAcc = 0;
			item.blocklyContinue('turn_right');
		},100);
	});	
	//跳
	Blockly.Blocks['jump'] = {
	  init: function() {
		appendCharacterDropdown(this.appendDummyInput())
			.appendField(Blockly.Msg.JUMP);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(3);
	 this.setTooltip("");
	 this.setHelpUrl("");
	  }
	};

	Blockly.JavaScript['jump'] = function(block) {
	  var charcter_name = block.getFieldValue('CHARCTER');
	  var code = 'jump("'+charcter_name+'");\n';
	  return code;
	};
	
	_this.injectBlocklyFunction('jump',function(name){
		var item = getItemByName(name);
		if(!item)return;
		if((item._isobstruct||item.resultAction==='break') && !eqAngle(item.rotation.z-Math.PI,item.forwardAngle)){
			item.velocity.z = JUMP_SPEED;
			ItemAction(item,'jump');
			if(item.currentAction === 'jumpwall')
				item.currentAction = 'jumpwall';				
			else
				item.currentAction = 'jump';
			item.blocklyStop('jump orgine');
			return;
		}
		item.blocklyStop('jump');
		item.currentAction = 'jump';
		this.resultAction = '';
		if(item.forwardT!==undefined && item.forwardT!=1){
			var d = calcD(item);
			item.forwardBegin = {x:item.position.x,y:item.position.y};
			item.forwardEnd = {
				x:item.position.x+Math.cos(item.rotation.z-Math.PI/2)*d,
				y:item.position.y+Math.sin(item.rotation.z-Math.PI/2)*d
			};
		}else{
			item.forwardBegin = {x:item.position.x,y:item.position.y};
			var d = JUMP_STEP*STEP;
			item.forwardAngle = item.rotation.z;
			item.forwardEnd = {
				x:item.position.x+Math.cos(item.rotation.z-Math.PI/2)*d,
				y:item.position.y+Math.sin(item.rotation.z-Math.PI/2)*d
			};
		}
		item.forwardT = 0;
		item.velocity.z = JUMP_SPEED;
		//var g = item.sceneManager.gravity;
		item.speed = SPEED/JUMP_STEP;//Math.abs(d*g)/(2*JUMP_SPEED);
		ItemAction(item,'jump');
	});

	// 移除障碍栅栏
	Blockly.Blocks['remove_obstacle_fence'] = {
	  init: function() {
		appendCharacterDropdown(this.appendDummyInput())
			.appendField(Blockly.Msg.CLEAR_OBSTACLE);
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(266);
	 this.setTooltip("");
	 this.setHelpUrl("");
	  }
	};

	Blockly.JavaScript['remove_obstacle_fence'] = function(block) {
	  var charcter_name = block.getFieldValue('CHARCTER');
	  var code = 'unlock("'+charcter_name+'");\n';
	  return code;
	};
	_this.injectBlocklyFunction('unlock',function(name){
		var item = getItemByName(name);
		if(!item)return;
		if(item.liftItem){
			item.blocklyStop('unlock liftitem obstruct');
			setTimeout(function(){item.blocklyEvent('WrongAction');},1000);			
			return;
		}
		if(item._obstructItem){
			if(item._obstructItem.typeName!=='栅栏'){
				item.blocklyStop('unlock obstruct');	
				setTimeout(function(){item.blocklyEvent('WrongAction');},1000);
				return;
			}
		}
		if(item._isobstruct && eqAngle(item.rotation.z,item.forwardAngle)){
			item.blocklyStop('unlock');
			
			ItemAction(item,'remove_cones');
			setTimeout(function(){
				item._obstructItem.unlock();
				
				item.currentAction = 'forward';
				var d = STEP - calcD(item);
				item.forwardBegin = {x:item.position.x,y:item.position.y};
				item.forwardEnd = {
					x:item.position.x+Math.cos(item.rotation.z-Math.PI/2)*d,
					y:item.position.y+Math.sin(item.rotation.z-Math.PI/2)*d
				};
				item.forwardT = 0;
				item.speed = 2*SPEED;

				ItemAction(item,'walk');
			},800);
		}else{
			ItemAction(item,'remove_cones');
			item.blocklyStop('unlock 2');
			setTimeout(function(){
				item.blocklyContinue('unlock 2');
			},300);
		}
	});		
	
	// 打开宝箱
	Blockly.Blocks['open_box'] = {
	  init: function() {
		appendCharacterDropdown(this.appendDummyInput())
			.appendField(Blockly.Msg.OPEN_BOX);
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(10);
	 this.setTooltip("");
	 this.setHelpUrl("");
	  }
	};	
	Blockly.JavaScript['open_box'] = function(block) {
	  var charcter_name = block.getFieldValue('CHARCTER');
	  var code = 'openbox("'+charcter_name+'");\n';
	  return code;
	};	
	_this.injectBlocklyFunction('openbox',function(name){
		var item = getItemByName(name);
		if(!item)return;
		if(item.liftItem){
			item.blocklyStop('openbox liftitem obstruct');
			setTimeout(function(){item.blocklyEvent('WrongAction');},1000);			
			return;
		}		
		if(item._obstructItem){
			if(item._obstructItem.typeName!=='盒子'){
				item.blocklyStop('openbox obstruct');	
				setTimeout(function(){item.blocklyEvent('WrongAction');},1000);
				return;
			}
		}
		
		if(item._isobstruct && item.usekey && eqAngle(item.rotation.z,item.forwardAngle)){
			item.blocklyStop('openbox');
			ItemAction(item,'remove_cones');
			setTimeout(function(){
				item.usekey(item._obstructItem);
				item.blocklyContinue('openbox usekey');
				//ItemAction(item,'hail'); //欢呼
			},800);
		}else{
			ItemAction(item,'remove_cones');
			item.blocklyStop('openbox2');
			setTimeout(function(){
				item.blocklyContinue('openbox2');
			},300);
		}
	});
	
	// 举起
	Blockly.Blocks['lift_up'] = {
	  init: function() {
		appendCharacterDropdown(this.appendDummyInput())
			.appendField(Blockly.Msg.LIFT_UP);
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(11);
	 this.setTooltip("");
	 this.setHelpUrl("");
	  }
	};	
	Blockly.JavaScript['lift_up'] = function(block) {
	  var charcter_name = block.getFieldValue('CHARCTER');
	  var code = 'liftUp("'+charcter_name+'");\n';
	  return code;
	};	
	_this.injectBlocklyFunction('liftUp',function(name){
		var item = getItemByName(name);
		if(!item)return;
		if(item._obstructItem){
			if(item._obstructItem.typeName!=='石块'){
				item.blocklyStop('lift_up obstruct');	
				setTimeout(function(){item.blocklyEvent('WrongAction');},1000);
				return;
			}
		}
		
		if(item._isobstruct && eqAngle(item.rotation.z,item.forwardAngle)){
			item.blocklyStop('lift up');
			ItemAction(item,'lift_up_item');
			item._noidle = true;
			setTimeout(function(){
				item._obstructItem.gravity = false;
				item._obstructItem.collision = false;
				item._obstructItem.position.z += item.aabb().depth()/2;
			},200);
			setTimeout(function(){
				item.liftItem = item._obstructItem;
				item.liftItem.gravity = false;
				item.liftItem.collision = false;
				item.liftItem.position.set(item.position.x,item.position.y,item.position.z+item.aabb().depth());
				
				item.currentAction = 'forward';
				var d = STEP - calcD(item);
				item.forwardBegin = {x:item.position.x,y:item.position.y};
				item.forwardEnd = {
					x:item.position.x+Math.cos(item.rotation.z-Math.PI/2)*d,
					y:item.position.y+Math.sin(item.rotation.z-Math.PI/2)*d
				};
				item.forwardT = 0;
				item.speed = 2*SPEED;

				ItemAction(item,'walk');
				item._noidle = false;
			},800);
		}else{
			ItemAction(item,'lift_up');
			item.blocklyStop('lift up 2');
			setTimeout(function(){
				item.blocklyContinue('lift up 2');
			},300);
		}
	});	
	
	// 放下
	Blockly.Blocks['put_down'] = {
	  init: function() {
		appendCharacterDropdown(this.appendDummyInput())
			.appendField(Blockly.Msg.PUT_DOWN);
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(12);
	 this.setTooltip("");
	 this.setHelpUrl("");
	  }
	};	
	Blockly.JavaScript['put_down'] = function(block) {
	  var charcter_name = block.getFieldValue('CHARCTER');
	  var code = 'putDown("'+charcter_name+'");\n';
	  return code;
	};
	_this.injectBlocklyFunction('putDown',function(name){
		var item = getItemByName(name);
		if(!item)return;
		if(!item.liftItem){
			item.blocklyStop('putDown obstruct');
			setTimeout(function(){item.blocklyEvent('WrongAction');},1000);	
			return;
		}
		var ab = item.liftItem.aabb();

		var cc = item.liftItem;
		var oldp = {x:cc.position.x,y:cc.position.y,z:cc.position.z}
		cc.position.set(item.liftItem.position.x+Math.cos(item.rotation.z-Math.PI/2)*STEP,
			item.liftItem.position.y+Math.sin(item.rotation.z-Math.PI/2)*STEP,
			item.liftItem.position.z-ab.depth()/2);
		var iscollision = false;
		for(var i=0;i<item.sceneManager.items.length;i++){
			var it = item.sceneManager.items[i];
			if((it.collision||it.ground) && it!==cc){
				if(it.collisionFunc(cc)){
					iscollision = true;
					break;
				}
			}
		}
		cc.position.set(oldp.x,oldp.y,oldp.z);
		if(!iscollision){ //能不能丢
			item.blocklyStop('put down');
			ItemAction(item,'put_down_item');

			setTimeout(function(){
				item.liftItem = item._obstructItem;
				item.liftItem.gravity = true;
				item.liftItem.collision = true; 
				
				item.liftItem.currentAction = 'forward';
				var d = STEP;
				item.liftItem.forwardBegin = {x:item.position.x,y:item.position.y};
				item.liftItem.forwardEnd = {
					x:item.position.x+Math.cos(item.rotation.z-Math.PI/2)*d,
					y:item.position.y+Math.sin(item.rotation.z-Math.PI/2)*d
				};
				item.liftItem.forwardT = 0;
				item.liftItem.speed = 2*SPEED;
				item.liftItem = null;
				setTimeout(function(){
					item.blocklyContinue('put down');
					//ItemAction(item,'idle');
				},200);
			},200);
		}else{
			ItemAction(item,'put_down_item');
			item.blocklyStop('put down 2');
			setTimeout(function(){
				item.blocklyContinue('put down 2');
			},300);
		}
	});		
	
	// 判断什么障碍物
	Blockly.Blocks['what_is_it'] = {
	  init: function() {
		appendCharacterDropdown(this.appendDummyInput())
			.appendField(Blockly.Msg.FORWARD_IS)
			.appendField(new Blockly.FieldDropdown([
			[Blockly.Msg.BARRIER,"barrier"], 
			[Blockly.Msg.DIAMOND,"diamond"],
			[Blockly.Msg.BOX,"chest"], 
			[Blockly.Msg.STON,"ston"], 
			[Blockly.Msg.LADDER,"ladder"],
			[Blockly.Msg.CLIFF,"cliff"],
			[Blockly.Msg.WALL,"wall"],]), "IT");
		this.setOutput(true, "Boolean");
		this.setColour(16);
	 this.setTooltip("");
	 this.setHelpUrl("");
	  }
	};
	Blockly.JavaScript['what_is_it'] = function(block) {
	  var charcter_name = block.getFieldValue('CHARCTER');
	  var it_name = block.getFieldValue('IT');

	  var code = 'whatIt("'+charcter_name+'","'+it_name+'")';

	  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
	};
	_this.injectBlocklyFunction('whatIt',function(name,it){
		var item = getItemByName(name);
		if(!item)return;

		var d = (item.forwardT!==undefined && item.forwardT!=1) ? (calcD(item)) : (1*STEP);
		var pt = {
			x:item.position.x+Math.cos(item.rotation.z-Math.PI/2)*d,
			y:item.position.y+Math.sin(item.rotation.z-Math.PI/2)*d,
			z:item.position.z+7.9
		};
		
//		RemoveArrowHelper(item.sceneManager,lastArrowHelper);
//		lastArrowHelper = AddArrowHelper(item.sceneManager,
//			new THREE.Vector3(0,0,1),
//			new THREE.Vector3(pt.x,pt.y,pt.z));
		
		var ar = item.sceneManager.ptItem(pt);
		var i,z;
		switch(it){
			case 'barrier':
				console.log(ar);
				for(i=0;i<ar.length;i++){
					if(ar[i].typeName==='栅栏')return true;
				}
				break;
			case 'chest':
				for(i=0;i<ar.length;i++){
					if(ar[i].typeName==='盒子')return true;
				}
				break;
			case 'flag':
				for(i=0;i<ar.length;i++){
					if(ar[i].typeName==='终点旗帜')return true;
				}			
				break;
			case 'ston':
				for(i=0;i<ar.length;i++){
					if(ar[i].typeName==='石块')return true;
				}			
				break;				
			case 'ladder':
				if(ar.length===0){
					pt.z = item.position.z+1;
					ar = item.sceneManager.ptItem(pt);
					//AddCrossHelper(item.sceneManager,new THREE.Vector3(pt.x,pt.y,pt.z),10);	
					//console.log(ar);
					for(i=0;i<ar.length;i++){
						if(ar[i].ground){
							return true;
						}
					}
				//	pt.z = item.position.z+7.9;
				//	ar = item.sceneManager.ptItem(pt);
				//	for(i=0;i<ar.length;i++){
				//		if(ar[i].ground){return true;}
				//	}
				}
				break;
			case 'cliff':
				for(z = 0;z < 15;z++){
					pt.z = item.position.z-z;
					ar = item.sceneManager.ptItem(pt);
					for(i=0;i<ar.length;i++){
						if(ar[i].ground)return false;
					}
				}
				return true;
			case 'wall':
				for(i=0;i<ar.length;i++){
					if(ar[i].ground)return true;
				}			
				break;
		}
		return false;
	});
}

regItemEvent('角色',
function(event,dt,z){
	switch(event){
		case 'init':
			this.idleAcc = 0;
			initItemBlockly(this);
			this.syncLiftItem = function(){
				if(this.liftItem){
					this.liftItem.position.x = this.position.x;
					this.liftItem.position.y = this.position.y;
					this.liftItem.position.z = this.position.z+this.aabb().depth();
				}
			}
			console.log(this.name+' 登场');
			break;
		case 'release':
			characters = [];
			console.log(this.name+' 退出');
			break;
		case 'swiming':
			break;
		case 'fall':
			if(!dt&&z&& Math.abs(z)>=15){
				this.currentAction='empty'
				this.doAction('jump_dead');
				this.blocklyEvent('FallDead');
			}
			if((this.currentAction==='jump'||this.currentAction==='jumpwall') && !dt){
				if(this._isobstruct)this._isobstruct = false;
				this.idleAcc = 0;				
				if(this.currentAction==='jump'){
					this.position.x = this.forwardEnd.x;
					this.position.y = this.forwardEnd.y;				
					this.forwardT = 1;
					this.resultAction = 'done';
					this.blocklyContinue('jump fall');
				}else{
					this.resultAction = 'break';
					this.blocklyContinue('jumpwall fall');
				}
				this.syncLiftItem();
				this.currentAction = '';
			}
			break;
		case 'collision':
			break;
		case 'wall':
			if(this.currentAction==='forward'){
				this.currentAction = 'forwardwall';
				this.forwardTT = this.forwardT;
			}else if(this.currentAction==='jump'){
				this.currentAction = 'jumpwall';
			}
			break;
		case 'update':
			if(this.position.z < -50){
				this.blocklyEvent('OutOfBounds');
			}
			if(this.forwardEnd&&this.currentAction==='forward'){
				var t = this.forwardT;
				if(t>=1){
					t = 1;
					if(this._isobstruct)this._isobstruct = false;
					this.currentAction = '';
					this.idleAcc = 0;
					this.resultAction = 'done';
					this.blocklyContinue('forward update');
				}
				this.position.x = this.forwardEnd.x*t + this.forwardBegin.x*(1-t);
				this.position.y = this.forwardEnd.y*t + this.forwardBegin.y*(1-t);
				this.syncLiftItem();
				this.forwardT += this.speed*dt/1000;
				if(this.forwardT>1)this.forwardT = 1;
			}else if(this.currentAction==='jump'){
				var t = this.forwardT;
				if(t>=1){
					t = 1;
				}
				this.position.x = this.forwardEnd.x*t + this.forwardBegin.x*(1-t);
				this.position.y = this.forwardEnd.y*t + this.forwardBegin.y*(1-t);
				this.syncLiftItem();
				this.forwardT += this.speed*dt/1000;
				if(this.forwardT>1)this.forwardT = 1;
			}else if(this.currentAction==='forwardwall'){
				this.forwardTT += this.speed*dt/1000;
				if(this.forwardTT>1){
					if(this._isobstruct)this._isobstruct = false;
					this.currentAction = '';
					this.resultAction = 'break';
					this.idleAcc = 0;
					this.blocklyContinue('forwardwall');
				}
			}else if(this.currentAction==='jumpwall'){
				this.syncLiftItem();			
			}else if(this.currentAction==='empty'){
			}else if(this.currentActionName()!=='idle'&&this.currentActionName()!=='lift_up_item_idle'){
				if(this._noidle)break;
				//idle
				this.idleAcc += dt;
				if(this.syncLiftItem)this.syncLiftItem();
				if(this._isobstruct&&this.curAction.name==='remove_cones'){
				//正在开栅栏
				}else if(this.idleAcc>300){
					this.idleAcc = 0;
					if(this.liftItem){
						this.doAction('lift_up_item_idle');
					}else{
						this.doAction('idle');
					}
				}
			}
			break;
	}
});

})();