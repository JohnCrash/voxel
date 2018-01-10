(function(){

var _x = 0;
var _y = 0;
var _z = 0;
var _dir = 0;
var _stack = [];
function initItemBlockly(_this){
	_x = 0;
	_y = 0;
	_z = 0;
	_dir = 0;
	_stack = [];
	if(typeof(Blockly)==='undefined')return;
	//关闭代码连接连接检查
	if(GLOBAL && GLOBAL._blocklyView){
		GLOBAL._blocklyView.setConfig({checklink:false,
			disableHotkey:false,disableRightClick:false,customcolor:false});
	}
	
	//开始
	Blockly.Blocks['when_start'] = {
	init: function () {
		Blockly.BlockSvg.START_HAT = true;
		this.setColour(0);
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
		this.setColour(135);
		this.appendValueInput("STEP")
			.setCheck("Number")
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
		var number_step = Blockly.JavaScript.valueToCode(block, 'STEP', Blockly.JavaScript.ORDER_ATOMIC);
		var code = 'forward('+number_step+');\n';
		return code;
	};
	_this.injectBlocklyFunction('forward',function(step){
		_x += step*Math.cos(_dir);
		_y += step*Math.sin(_dir);
		_this.blocklyContinue('forward');
	});
	//左转
	Blockly.Blocks['turn_left'] = {
	  init: function() {
		this.setColour(210);
		this.appendDummyInput()
			.appendField(Blockly.Msg.TURN_LEFT)
			.appendField(new Blockly.FieldAngle(90),"angle");
		this.setPreviousStatement(true, "null");
		this.setNextStatement(true, "null");
		this.setTooltip('');
	  }
	};

	Blockly.JavaScript['turn_left'] = function(block) {
	  var angle = block.getFieldValue('angle');
	  var code = 'turn_left('+angle+');\n';
	  return code;
	};
	
	_this.injectBlocklyFunction('turn_left',function(angle){
		_dir -= angle*Math.PI/180;
		_this.blocklyContinue('turn_left');
	});	
	//右转
	Blockly.Blocks['turn_right'] = {
	  init: function() {
		this.setColour(210);
		this.appendDummyInput()
			.appendField(Blockly.Msg.TURN_RIGHT)
			.appendField(new Blockly.FieldAngle(90),"angle");
		this.setPreviousStatement(true, "null");
		this.setNextStatement(true, "null");
		this.setTooltip('');
	  }
	};

	Blockly.JavaScript['turn_right'] = function(block) {
	  var angle = block.getFieldValue('angle');
	  var code = 'turn_right('+angle+');\n';
	  return code;
	};
	
	_this.injectBlocklyFunction('turn_right',function(angle){
		_dir += angle*Math.PI/180;
		_this.blocklyContinue('turn_right');
	});		
	//向上
	Blockly.Blocks['down_up'] = {
	  init: function() {
		this.setColour(270);
		this.appendValueInput("STEP")
			.setCheck("Number")
			.appendField(Blockly.Msg.DOWN_UP);
			
		this.appendDummyInput()
			.appendField(Blockly.Msg.STEP)
		this.setPreviousStatement(true, "null");
		this.setNextStatement(true, "null");
		this.setTooltip('');
	  }
	};

	Blockly.JavaScript['down_up'] = function(block) {
	  var number_step = Blockly.JavaScript.valueToCode(block, 'STEP', Blockly.JavaScript.ORDER_ATOMIC);
	  var code = 'down_up('+number_step+');\n';
	  return code;
	};
	
	_this.injectBlocklyFunction('down_up',function(step){
		_z += step;
		_this.blocklyContinue('down_up');
	});
	//放置块
	Blockly.Blocks['put_block'] = {
	  init: function() {
		this.setColour(0);
		this.appendDummyInput()
			.appendField(Blockly.Msg.PUT_BLOCK)
			.appendField(new Blockly.FieldColour("#33cc00"), "color");
		this.setPreviousStatement(true, "null");
		this.setNextStatement(true, "null");
		this.setTooltip('');
	  }
	};

	Blockly.JavaScript['put_block'] = function(block) {
	  var colour_color = block.getFieldValue('color');
	  var code = 'put_block('+colour_color+');\n';
	  return code;
	};
	
	_this.injectBlocklyFunction('put_block',function(colour_color){
		//_x,_y,_z ,_dir
		_this.sceneManager.addItem({
			position : {x:_x,y:_y,z:_z},
			rotation : {x:0,y:0,z:_dir},
			name : '1x1x1',
			ground : false,
			fixed : false,
			gravity : true,
			castShadow : true,
			receiveShadow : false,
			file : 'vox/1x1x1.vox'
		});
		_this.blocklyContinue('put_block');
	});	
	//保存位置
	Blockly.Blocks['push'] = {
	  init: function() {
		this.setColour(240);
		this.appendDummyInput()
			.appendField(Blockly.Msg.PUSH)
		this.setPreviousStatement(true, "null");
		this.setNextStatement(true, "null");
		this.setTooltip('');
	  }
	};

	Blockly.JavaScript['push'] = function(block) {
	  var code = 'push();\n';
	  return code;
	};
	
	_this.injectBlocklyFunction('push',function(){
		_stack.push({_x,_y,_z,_dir});
		_this.blocklyContinue('push');
	});	
	//恢复位置
	Blockly.Blocks['pop'] = {
	  init: function() {
		this.setColour(240);
		this.appendDummyInput()
			.appendField(Blockly.Msg.POP)
		this.setPreviousStatement(true, "null");
		this.setNextStatement(true, "null");
		this.setTooltip('');
	  }
	};

	Blockly.JavaScript['pop'] = function(block) {
	  var code = 'pop();\n';
	  return code;
	};
	
	_this.injectBlocklyFunction('pop',function(){
		var v = _stack.pop();
		_x = v._x;
		_y = v._y;
		_z = v._z;
		_dir = v._dir;
		_this.blocklyContinue('pop');
	});	
}

regItemEvent('3dprinter',
function(event,dt){
	switch(event){
		case 'collision':
			break;
		case 'init':
			initItemBlockly(this);
			console.log(this.name+'  登场');
			break;
		case 'release':
			console.log(this.name+' 退出');
			break;
		case 'update':
			break;
	}
});

})();