(function(){

var STEP = 17;
var SPEED = 1;
var JUMP_SPEED = 47;
var JUMP_STEP = 1;

function initItemBlockly(item){
	if(typeof(Blockly)==='undefined')return;
	item.forwardAngle = item.rotation.z;
	//开始
	Blockly.Blocks['when_start'] = {
    init: function () {
        Blockly.BlockSvg.START_HAT = true;
        this.setColour(60);
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_CENTRE)
            .appendField("开始运行程序");
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
        this.setColour(200);
        this.appendValueInput("STEP")
            .setCheck("Number")
            .appendField("向前移动");
        this.appendDummyInput()
            .appendField("步");
        this.setInputsInline(true);
        this.setPreviousStatement(true, "null");
        this.setNextStatement(true, "null");
        this.setTooltip('');
        this.contextMenu = false;
		}
	};
	
	Blockly.JavaScript['forward'] = function (block) {
		var number_step = Blockly.JavaScript.valueToCode(block, 'STEP', Blockly.JavaScript.ORDER_ATOMIC);
		var code = `forward(${number_step});\n`;
		return code;
	};
	
	item.obstruct = function(i){
		if(!this._isobstruct){
			this._isobstruct = true;
			this._obstructItem = i;
			this.currentAction='idle';
			this.blocklyContinue('collision obstruct');
		}
	}
	function eqAngle(a1,a2){ //
		let a = (a2-a1)/(2*Math.PI);
		let b = Math.floor(a);
		return Math.abs(a-b)<0.01;
	}
	function calcD(item){
		let d = Math.sqrt((item.forwardBegin.x-item.position.x)*(item.forwardBegin.x-item.position.x)+(item.forwardBegin.y-item.position.y)*(item.forwardBegin.y-item.position.y));
		return d - Math.floor(d/STEP)*STEP;
	}
	item.injectBlocklyFunction('forward',function(step){
		if(item._isobstruct && !eqAngle(item.rotation.z-Math.PI,item.forwardAngle)){
			item.blocklyStop();
			item.doAction('walk');
			setTimeout(function(){
				item.doAction('idle');
				item.blocklyContinue('forward');
			},300);
			return;
		}
		
		item.blocklyStop();
		item.currentAction = 'forward';
		
		if(item._isobstruct){//碰到栅栏退回
			let d = (step-1)*STEP + calcD(item);
			item.forwardBegin = {x:item.position.x,y:item.position.y};
			item.forwardEnd = {
				x:item.position.x+Math.cos(item.rotation.z-Math.PI/2)*d,
				y:item.position.y+Math.sin(item.rotation.z-Math.PI/2)*d
			};
		}else{
			item.forwardBegin = {x:item.position.x,y:item.position.y};
			item.forwardAngle = item.rotation.z;
			let d = step*STEP;
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
		
		item.doAction('walk');
	});

	//左转
	Blockly.Blocks['turn_left'] = {
	  init: function() {
		this.setColour(160);
		this.appendDummyInput()
			.appendField("左转 90°")
		this.setPreviousStatement(true, "null");
		this.setNextStatement(true, "null");
		this.setTooltip('');
	  }
	};

	Blockly.JavaScript['turn_left'] = function(block) {
	  // TODO: Assemble JavaScript into code variable.
	  var code = 'turn_left();\n';
	  return code;
	};
	
	item.injectBlocklyFunction('turn_left',function(){
		item.blocklyStop('turn_left');
		item.currentAction = 'empty';
		item.rotation.z += Math.PI/2;
		item.doAction('walk');
		setTimeout(function(){
			item.currentAction = '';
			item.idleAcc = 0;
			item.blocklyContinue('turn_left');
		},100);
	});
	//右转
	Blockly.Blocks['turn_right'] = {
	  init: function() {
		this.setColour(160);
		this.appendDummyInput()
			.appendField("右转 90°")
		this.setPreviousStatement(true, "null");
		this.setNextStatement(true, "null");
		this.setTooltip('');
	  }
	};

	Blockly.JavaScript['turn_right'] = function(block) {
	  // TODO: Assemble JavaScript into code variable.
	  var code = 'turn_right();\n';
	  return code;
	};
	
	item.injectBlocklyFunction('turn_right',function(){
		item.blocklyStop('turn_right');
		item.currentAction = 'empty';
		item.rotation.z -= Math.PI/2;
		item.doAction('walk');
		setTimeout(function(){
			item.currentAction = '';
			item.idleAcc = 0;
			item.blocklyContinue('turn_right');
		},100);
	});	
	//跳
	Blockly.Blocks['jump'] = {
	  init: function() {
		this.appendDummyInput()
			.appendField("向前跳跃");
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(0);
	 this.setTooltip("");
	 this.setHelpUrl("");
	  }
	};

	Blockly.JavaScript['jump'] = function(block) {
	  // TODO: Assemble JavaScript into code variable.
	  var code = 'jump();\n';
	  return code;
	};
	
	item.injectBlocklyFunction('jump',function(){
		if(item._isobstruct && !eqAngle(item.rotation.z-Math.PI,item.forwardAngle)){
			item.velocity.z = JUMP_SPEED;
			item.doAction('jump');
			item.currentAction = 'jump2';
			item.blocklyStop('jump2');
			return;
		}
		item.blocklyStop('jump');
		item.currentAction = 'jump';
		if(item._isobstruct){//碰到栅栏退回
			let d = calcD(item);
			item.forwardBegin = {x:item.position.x,y:item.position.y};
			item.forwardEnd = {
				x:item.position.x+Math.cos(item.rotation.z-Math.PI/2)*d,
				y:item.position.y+Math.sin(item.rotation.z-Math.PI/2)*d
			};
		}else{
			item.forwardBegin = {x:item.position.x,y:item.position.y};
			let d = JUMP_STEP*STEP;
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
		item.doAction('jump');
	});

	// 移除障碍栅栏
	Blockly.Blocks['remove_obstacle_fence'] = {
	  init: function() {
		this.appendDummyInput()
			.appendField(" 移除障碍 ");
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(230);
	 this.setTooltip("");
	 this.setHelpUrl("");
	  }
	};

	Blockly.JavaScript['remove_obstacle_fence'] = function(block) {
	  // TODO: Assemble JavaScript into code variable.
	  var code = 'unlock();\n';
	  return code;
	};
	item.injectBlocklyFunction('unlock',function(){
		if(item._obstructItem){
			if(item._obstructItem.typeName!=='栅栏'){
				item.blocklyStop('unlock obstruct');	
				setTimeout(function(){item.blocklyEvent('WrongAction');},1000);
				return;
			}
		}
		if(item._isobstruct && eqAngle(item.rotation.z,item.forwardAngle)){
			item.blocklyStop('unlock');
			
			item.doAction('remove_cones');
			setTimeout(function(){
				item._obstructItem.unlock();
				
				item.currentAction = 'forward';
				let d = STEP - calcD(item);
				item.forwardBegin = {x:item.position.x,y:item.position.y};
				item.forwardEnd = {
					x:item.position.x+Math.cos(item.rotation.z-Math.PI/2)*d,
					y:item.position.y+Math.sin(item.rotation.z-Math.PI/2)*d
				};
				item.forwardT = 0;
				item.speed = 2*SPEED;

				item.doAction('walk');
			},800);
		}else{
			item.doAction('remove_cones');
			item.blocklyStop('unlock 2');
			setTimeout(function(){
				item.blocklyContinue('unlock 2');
			},300);
		}
	});		
	
	// 打开宝箱
	Blockly.Blocks['open_box'] = {
	  init: function() {
		this.appendDummyInput()
			.appendField(" 打开宝箱 ");
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(300);
	 this.setTooltip("");
	 this.setHelpUrl("");
	  }
	};	
	Blockly.JavaScript['open_box'] = function(block) {
	  // TODO: Assemble JavaScript into code variable.
	  var code = 'openbox();\n';
	  return code;
	};	
	item.injectBlocklyFunction('openbox',function(){
		if(item._obstructItem){
			if(item._obstructItem.typeName!=='盒子'){
				item.blocklyStop('openbox obstruct');	
				setTimeout(function(){item.blocklyEvent('WrongAction');},1000);
				return;
			}
		}
		
		if(item._isobstruct && item.usekey && eqAngle(item.rotation.z,item.forwardAngle)){
			item.blocklyStop('openbox');
			item.doAction('remove_cones');
			setTimeout(function(){
				item.usekey(item._obstructItem);
				item.blocklyContinue('openbox usekey');
				//item.doAction('hail'); //欢呼
			},800);
		}else{
			item.doAction('remove_cones');
			item.blocklyStop('openbox2');
			setTimeout(function(){
				item.blocklyContinue('openbox2');
			},300);
		}
	});		
}

regItemEvent('男孩',
function(event,dt,z){
	switch(event){
		case 'init':
			this.idleAcc = 0;
			initItemBlockly(this);
			console.log(`${this.name} 登场`);
			break;
		case 'release':
			console.log(`${this.name} 退出`);
			break;
		case 'swiming':
			break;
		case 'fall':
			if(!dt&&z&& Math.abs(z)>=15){
				this.blocklyEvent('FallDead');
			}
			if((this.currentAction==='jump'||this.currentAction==='jump2') && !dt){
				if(this._isobstruct)this._isobstruct = false;
				if(this.currentAction==='jump'){
					this.position.x = this.forwardEnd.x;
					this.position.y = this.forwardEnd.y;
				}				
				this.currentAction = '';
				this.idleAcc = 0;
				this.blocklyContinue('fall');
			}
			break;
		case 'collision':
			break;
		case 'wall':
			if(this.currentAction==='forward'){
				if(this._isobstruct)this._isobstruct = false;
				this.currentAction = '';
				this.idleAcc = 0;
				this.blocklyContinue('wall');
			}
			break;
		case 'update':
			if(this.position.z < -50)
				this.blocklyEvent('OutOfBounds');
			if(this.currentAction==='forward'||this.currentAction==='jump'){
				var t = this.forwardT;
				if(t>=1){
					t = 1;
					if(this.currentAction!='jump'){ //不落地不可以再次跳跃
						if(this._isobstruct)this._isobstruct = false;
						this.currentAction = '';
						this.idleAcc = 0;
						this.blocklyContinue('forward update');
					}
				}

				this.position.x = this.forwardEnd.x*t + this.forwardBegin.x*(1-t);
				this.position.y = this.forwardEnd.y*t + this.forwardBegin.y*(1-t);
				this.forwardT += this.speed*dt/1000;
			}else if(this.currentAction==='empty'){
			}else if(this.currentActionName()!=='idle'){
				//idle
				this.idleAcc += dt;
				if(this._isobstruct&&this.curAction.name==='remove_cones'){
				//正在开栅栏
				}else if(this.idleAcc>300){
					this.idleAcc = 0;
					this.doAction('idle');
				}
			}
			break;
	}
});

})();