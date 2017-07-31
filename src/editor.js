/**
 * 本例子主要测试不同的光照
 */
var Game = require("./game");
import SceneManager from './scenemanager';

var game = new Game({enableStats:false,
    enableAA:false,
    enableLight:true,
    enableShaodw:true});

game.on('init',function(){
});

game.run();
