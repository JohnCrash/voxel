Blockly.Blocks['forward'] = {
    init: function() {
        this.appendValueInput("step")
            .setCheck("Number")
            .appendField("前进");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(330);
    this.setTooltip("前进");
    this.setHelpUrl("");
    }
};

Blockly.JavaScript['forward'] = function(block) {
    var value_step = Blockly.JavaScript.valueToCode(block, 'step', Blockly.JavaScript.ORDER_ATOMIC);
    var code = `forward(${value_step});\n`;
    return code;
};

function forward(step){
    nextstep();
}

function initFunc(interpreter, scope){
    var logWrapper = function(text) {
        return console.log(text);
    };
    interpreter.setProperty(scope, 'log',
        interpreter.createNativeFunction(logWrapper));
}

module.exports = initFunc;