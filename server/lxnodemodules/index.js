// LXGridBase
(function(module, require, exports) {
        process.env.NODE_PATH = __dirname + '/LXSlices';
        require('module').Module._initPaths();

        const Ice = require('ice').Ice;
        const LXGrid = Ice.__M.require(module, [
            './LXGridBase/LXInvokerBase',
            './LXGridBase/LXCommunicator',
            './LXGridBase/LXReturnHelper',
            './LXGridBase/LXUtil',

            // Main
            './LXInvokers/LXSliceInvokerUser',
            './LXInvokers/LXSliceInvokerAsset',
            './LXInvokers/LXSliceInvokerPush',

            // App
            './LXInvokers/LXSliceInvokerLottery',

            // OM
            './LXInvokers/LXSliceInvokerEnterpriseAppAuth',
            './LXInvokers/LXSliceInvokerEnterpriseUser'
        ]).LXGrid;

        exports.LXGrid = LXGrid;
    }
    (typeof(global) !== 'undefined' && typeof(global.process) !== 'undefined' ? module : undefined,
        typeof(global) !== 'undefined' && typeof(global.process) !== 'undefined' ? require : window.Ice.__require,
        typeof(global) !== 'undefined' && typeof(global.process) !== 'undefined' ? exports : window));