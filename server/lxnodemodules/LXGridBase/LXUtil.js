// LXUtil
(function(module, require, exports) {
        const Ice = require('ice').Ice;
        const LXGrid = Ice.__M.require(module, [
            'LXGrid.System/LXSliceBase'
        ]).LXGrid;

        // 普通对象转Ice类
        LXGrid.LXObjectToClass = function(cls, data) {
            let object = new cls();
            for (const key in object) {
                if ((typeof(object[key]) != "function") && (key in data)) {
                    object[key] = data[key];
                }
            }
            return object;
        };

        // 普通对象转Ice类
        LXGrid.LXArrayToClass = function(cls, data) {
            let c = new Array();
            data.forEach((v) => c.push(LXGrid.LXObjectToClass(cls, v)));
            return c;
        };

        // Ice字典转普通对象
        LXGrid.LXDictToObject = function(data) {
            let o = new Object();
            data.forEach((key) => o[key] = data.get(key));
            return o;
        };

        // Ice字典转普通对象
        LXGrid.LXDictDictToObject = function(data) {
            let o = new Object();
            data.forEach((key) => {
                o[key] = LXGrid.LXDictToObject(data.get(key));
            });
            return o;
        };

        // 普通对象转Ice字典
        LXGrid.LXObjectToDict = function(dict, data) {
            let o = new dict();
            for (const i in data) {
                o.set(i, data[i]);
            }
            return o;
        };

        // 普通对象转Ice类字典
        LXGrid.LXObjectToClassDict = function(dict, cls, data) {
            let o = new dict();
            for (const i in data) {
                o.set(i, LXGrid.LXObjectToClass(cls, data[i]));
            }
            return o;
        };

        // Ice大整数转普通数
        LXGrid.LXLongToNumber = function(data) {
            return data.toNumber();
        };

        // 普通数转Ice大整数
        LXGrid.LXNumberToLong = function(data) {
            return new Ice.Long(0, data);
        };

        exports.LXGrid = LXGrid;
    }
    (typeof(global) !== 'undefined' && typeof(global.process) !== 'undefined' ? module : undefined,
        typeof(global) !== 'undefined' && typeof(global.process) !== 'undefined' ? require : window.Ice.__require,
        typeof(global) !== 'undefined' && typeof(global.process) !== 'undefined' ? exports : window));