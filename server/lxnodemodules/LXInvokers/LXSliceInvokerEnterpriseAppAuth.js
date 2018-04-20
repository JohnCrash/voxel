// LXInvokerBase
(function(module, require, exports) {
        const Ice = require('ice').Ice;
        LXGrid = Ice.__M.require(module, ["LXGrid.OM/LXSliceGridDefine", "LXGrid.OM/Enterprise/LXSliceEnterpriseAuth", '../LXGridBase/LXInvokerBase']).LXGrid;

        const LXInvokerBase = LXGrid.LXInvokerBase;

        class LXSliceInvokerEnterpriseAppAuth extends LXInvokerBase {
            constructor(filename) {
                super(filename, LXGrid.ThisGridName, LXGrid.ClusterNameEnterpriseAuth, LXGrid.Enterprise.Auth.IObjectEnterpriseAppAuthName);
            }

            // APP登录
            // @参数 1.UserToken 2.APPID
            // @返回 1.AccessToken
            AppLogin(usertoken, appid) {
                return this.Invoke(0, (prxBase) => {
                    let proxy = LXGrid.Enterprise.Auth.IObjectEnterpriseAppAuthPrx.uncheckedCast(prxBase);
                    return proxy.AppLogin(usertoken, appid);
                });
            }

            // APP退出
            // @参数 1.AccessToken
            // @返回 无
            AppLogout(accesstoken) {
                return this.Invoke(0, (prxBase) => {
                    let proxy = LXGrid.Enterprise.Auth.IObjectEnterpriseAppAuthPrx.uncheckedCast(prxBase);
                    return proxy.AppLogout(accesstoken);
                });
            }

            // 查询在线状态
            // @参数 1.AccessToken
            // @返回 1.APP在线状态(SJOnlineDeviceAppDict)
            GetOnlineStatus(userid) {
                return this.Invoke(0, (prxBase) => {
                    let proxy = LXGrid.Enterprise.Auth.IObjectEnterpriseAppAuthPrx.uncheckedCast(prxBase);
                    return proxy.GetOnlineStatus(userid);
                });
            }

            // 访问令牌校验
            // @参数 1.AccessToken 2.APPID
            // @返回 1.APP在线状态(SJOnlineApp) 2.SJOnlineDevice 3.userid
            CheckAccessToken(accesstoken) {
                return this.Invoke(0, (prxBase) => {
                    let proxy = LXGrid.Enterprise.Auth.IObjectEnterpriseAppAuthPrx.uncheckedCast(prxBase);
                    return proxy.CheckAccessToken(accesstoken);
                });
            }
        };

        LXGrid.LXSliceInvokerEnterpriseAppAuth = LXSliceInvokerEnterpriseAppAuth;
        exports.LXGrid = LXGrid;
    }
    (typeof(global) !== 'undefined' && typeof(global.process) !== 'undefined' ? module : undefined,
        typeof(global) !== 'undefined' && typeof(global.process) !== 'undefined' ? require : window.Ice.__require,
        typeof(global) !== 'undefined' && typeof(global.process) !== 'undefined' ? exports : window));