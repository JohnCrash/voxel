// LXInvokerBase
(function(module, require, exports) {
        const Ice = require('ice').Ice;
        LXGrid = Ice.__M.require(module, [
            'LXGrid.Main/LXSliceGridMainDefine',
            'LXGrid.Main/User/LXSliceUserDefine',
            'LXGrid.Main/User/LXSliceUserBase',
            '../LXGridBase/LXInvokerBase',
            '../LXGridBase/LXReturnHelper',
            '../LXGridBase/LXUtil'
        ]).LXGrid;

        const LXInvokerBase = LXGrid.LXInvokerBase;

        class LXSliceInvokerUser extends LXInvokerBase {
            constructor(filename) {
                super(filename,
                    LXGrid.Main.ThisGridName,
                    LXGrid.Main.ClusterNameUser,
                    LXGrid.Main.User.IObjectUserBaseName);
            }

            // 获取用户信息
            GetUserInfo(uid) {
                return this.Invoke(uid, (prxBase) => {
                    let proxy = LXGrid.Main.User.IObjectUserBasePrx.uncheckedCast(prxBase);
                    return proxy.GetUserInfo(uid);
                });
            }
        };

        LXGrid.LXSliceInvokerUser = LXSliceInvokerUser;
        exports.LXGrid = LXGrid;
    }
    (typeof(global) !== 'undefined' && typeof(global.process) !== 'undefined' ? module : undefined,
        typeof(global) !== 'undefined' && typeof(global.process) !== 'undefined' ? require : window.Ice.__require,
        typeof(global) !== 'undefined' && typeof(global.process) !== 'undefined' ? exports : window));