// LXInvokerBase
(function (module, require, exports) {
    const Ice = require('ice').Ice;
    LXGrid = Ice.__M.require(module, [
        'LXGrid.Main/LXSliceGridMainDefine',
        'LXGrid.Main/Push/LXSlicePush',
        '../LXGridBase/LXInvokerBase',
        '../LXGridBase/LXReturnHelper',
        '../LXGridBase/LXUtil'
    ]).LXGrid;

    class LXSliceInvokerPush extends LXGrid.LXInvokerBase {
        constructor(filename) {
            super(filename,
                LXGrid.Main.ThisGridName,
                LXGrid.Main.ClusterNamePush,
                LXGrid.Main.Push.IObjectPushName);
        }

        /**
        *  推用户
        *      
        *  @参数 appid: 当前应用AppID
        *  @参数 userids: 用户ID数组
        *  @参数 message: 推送消息字符串
        *  @参数 context:  上下文字符串(内容相关,一般为空)
        */
        PushUserMessage(appid, userids, message, context) {
            return this.Invoke(appid, (prxBase) => {
                let proxy = LXGrid.Main.Push.IObjectPushPrx.uncheckedCast(prxBase);
                return proxy.PushUserMessage(appid, userids, message, context);
            });
        }

        // 搜索接口

        /**
        *  推地区
        *      
        *  @参数 appid: 当前应用AppID
        *  @参数 areaid: 地区ID
        *  @参数 roles: 用户身份数组(学校、老师...)
        *  @参数 grades: 年级数组(1年级、2年级...)
        *  @参数 message: 推送消息字符串
        *  @参数 context:  上下文字符串(内容相关,一般为空)
        *  @参数 member: 可选参数, 标识会员appid, +appid:app会员用户 -appid:app非会员用户
        */
        PushAreaMessage(appid, areaid, roles, grades, message, context, member) {
            return this.Invoke(appid, (prxBase) => {
                let proxy = LXGrid.Main.Push.IObjectPushPrx.uncheckedCast(prxBase);
                return proxy.PushAreaMessage(appid, areaid, roles, grades, message, context, member);
            });
        }

        /**
        *  推学校
        *      
        *  @参数 appid: 当前应用AppID
        *  @参数 schoolid: 学校ID
        *  @参数 roles: 用户身份数组(学校、老师...)
        *  @参数 grades: 年级数组(1年级、2年级...)
        *  @参数 message: 推送消息字符串
        *  @参数 context:  上下文字符串(内容相关,一般为空)
        *  @参数 member: 可选参数, 标识会员appid, +appid:app会员用户 -appid:app非会员用户
        */
        PushSchoolMessage(appid, schoolid, roles, grades, message, context, member) {
            return this.Invoke(appid, (prxBase) => {
                let proxy = LXGrid.Main.Push.IObjectPushPrx.uncheckedCast(prxBase);
                return proxy.PushSchoolMessage(appid, schoolid, roles, grades, message, context, member);
            });
        }

        /**
        *  推班级、家长群
        *      
        *  @参数 appid: 当前应用AppID
        *  @参数 zoneid: 班级、群组ID
        *  @参数 roles: 用户身份数组(学校、老师...)
        *  @参数 grades: 年级数组(1年级、2年级...)
        *  @参数 message: 推送消息字符串
        *  @参数 context:  上下文字符串(内容相关,一般为空)
        *  @参数 member: 可选参数, 标识会员appid, +appid:app会员用户 -appid:app非会员用户
        */
        PushClassMessage(appid, zoneid, roles, grades, message, context, member) {
            return this.Invoke(appid, (prxBase) => {
                let proxy = LXGrid.Main.Push.IObjectPushPrx.uncheckedCast(prxBase);
                return proxy.PushClassMessage(appid, zoneid, roles, grades, message, context, member);
            });
        }
    };

    LXGrid.LXSliceInvokerPush = LXSliceInvokerPush;
    exports.LXGrid = LXGrid;
}
    (typeof (global) !== 'undefined' && typeof (global.process) !== 'undefined' ? module : undefined,
    typeof (global) !== 'undefined' && typeof (global.process) !== 'undefined' ? require : window.Ice.__require,
    typeof (global) !== 'undefined' && typeof (global.process) !== 'undefined' ? exports : window));