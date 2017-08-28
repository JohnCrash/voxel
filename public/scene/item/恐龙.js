(function(){
var STEP = 1;
var SPEED = 5;
var JUMP_SPEED = 50;
var JUMP_STEP = 5;

function initItemBlockly(item){
	if(typeof(Blockly)==='undefined')return;
	//前进
	Blockly.Blocks['forward'] = {
	  init: function() {
		this.appendDummyInput()
			.appendField("前进")
			.appendField(new Blockly.FieldNumber(1, -Infinity, Infinity, 1), "STEP");
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(315);
	 this.setTooltip("");
	 this.setHelpUrl("");
	  }
	};

	Blockly.JavaScript['forward'] = function(block) {
		var number_step = block.getFieldValue('STEP');
		var code = `forward(${number_step});\n`;
		return code;
	};
	
	item.injectBlocklyFunction('forward',function(step){
		item.blocklyStop();
		item.currentAction = 'forward';
		item.forwardBegin = {x:item.position.x,y:item.position.y};
		var d = step*STEP;
		item.forwardEnd = {
			x:item.position.x+Math.cos(item.rotation.z)*d,
			y:item.position.y+Math.sin(item.rotation.z)*d
		};
		item.forwardT = 0;
		if(step>0)
			item.speed = SPEED/step;
		else
			item.speed = SPEED;
		item.doAction('run');
	});
	//左转
	Blockly.Blocks['turn_left'] = {
	  init: function() {
		this.appendDummyInput()
			.appendField("左转");
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(230);
	 this.setTooltip("");
	 this.setHelpUrl("");
	  }
	};

	Blockly.JavaScript['turn_left'] = function(block) {
	  // TODO: Assemble JavaScript into code variable.
	  var code = 'turn_left();\n';
	  return code;
	};
	
	item.injectBlocklyFunction('turn_left',function(){
		item.blocklyStop();
		item.currentAction = 'empty';
		item.rotation.z += Math.PI/2;
		item.doAction('run');
		setTimeout(function(){
			item.currentAction = '';
			item.idleAcc = 0;
			item.blocklyContinue();
		},100);
	});
	//右转
	Blockly.Blocks['turn_right'] = {
	  init: function() {
		this.appendDummyInput()
			.appendField("右转");
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(230);
	 this.setTooltip("");
	 this.setHelpUrl("");
	  }
	};

	Blockly.JavaScript['turn_right'] = function(block) {
	  // TODO: Assemble JavaScript into code variable.
	  var code = 'turn_right();\n';
	  return code;
	};
	
	item.injectBlocklyFunction('turn_right',function(){
		item.blocklyStop();
		item.currentAction = 'empty';
		item.rotation.z -= Math.PI/2;
		item.doAction('run');
		setTimeout(function(){
			item.currentAction = '';
			item.idleAcc = 0;
			item.blocklyContinue();
		},100);
	});	
	//跳
	Blockly.Blocks['jump'] = {
	  init: function() {
		this.appendDummyInput()
			.appendField("跳");
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
		item.blocklyStop();
		item.currentAction = 'jump';
		item.forwardBegin = {x:item.position.x,y:item.position.y};
		var d = JUMP_STEP*STEP;
		item.forwardEnd = {
			x:item.position.x+Math.cos(item.rotation.z)*d,
			y:item.position.y+Math.sin(item.rotation.z)*d
		};
		item.forwardT = 0;
		item.velocity.z = JUMP_SPEED;
		var g = item.sceneManager.gravity;
		item.speed = SPEED/JUMP_STEP;//Math.abs(d*g)/(2*JUMP_SPEED);
		item.doAction('run');
	});	
}

regItemEvent('霸王龙',
function(event,dt){
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
		case 'wall':
			if(this.currentAction==='forward'){
				this.currentAction = '';
				this.idleAcc = 0;
				this.blocklyContinue();
			}
			break;
		case 'update':
			if(this.position.z < -50)
				this.blocklyEvent('OutOfBounds');
			if(this.currentAction==='forward'||this.currentAction==='jump'){
				var t = this.forwardT;
				if(t>=1){
					t = 1;
					this.currentAction = '';
					this.idleAcc = 0;
					this.blocklyContinue();
				}
				this.position.x = this.forwardEnd.x*t + this.forwardBegin.x*(1-t);
				this.position.y = this.forwardEnd.y*t + this.forwardBegin.y*(1-t);
				this.forwardT += this.speed*dt/1000;
			}else if(this.currentAction==='empty'){
			}else if(this.currentActionName()!=='idle'){
				//idle
				this.idleAcc += dt;
				//console.log(`${this.idleAcc} / ${dt}`);
				if(this.idleAcc>300){
					this.idleAcc = 0;
					this.doAction('idle');
				}
			}
			break;
	}
});

})();