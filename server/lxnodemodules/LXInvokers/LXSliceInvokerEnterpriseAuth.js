// LXInvokerBase
(function(module, require, exports) {
        const Ice = require('ice').Ice;
        LXGrid = Ice.__M.require(module, ["LXGrid.OM/LXSliceGridDefine", "LXGrid.OM/Enterprise/LXSliceEnterpriseAuth", '../LXGridBase/LXInvokerBase']).LXGrid;

        const LXInvokerBase = LXGrid.LXInvokerBase;

        class LXSliceInvokerEnterpriseAuth extends LXInvokerBase {
            constructor(filename) {
                super(filename, LXGrid.ThisGridName, LXGrid.ClusterNameEnterpriseAuth, LXGrid.Enterprise.Auth.IObjectEnterpriseAuthName);
            }

            // 激活帐号
            // @参数 1.登录名 2.验证码 3.验证识别码 4.设备ID 5.设备类型(SJEnumDeviceType) 6.登录IP 6.新密码
            // @返回 1.UserToken 2.userid
            ActiveAccount(loginname, authcode, authtoken, deviceid, devicetype, ipaddress, password) {
                return this.Invoke(0, (prxBase) => {
                    let proxy = LXGrid.Enterprise.Auth.IObjectEnterpriseAuthPrx.uncheckedCast(prxBase);
                    return proxy.ActiveAccount(loginname, authcode, authtoken, deviceid, devicetype, ipaddress, password);
                });
            }

            // 密码登录
            // @参数 1.登录名 2.用户密码 3.设备ID 4.设备类型(SJEnumDeviceType) 5.登录IP 6.验证码 7.验证识别码
            // @返回 1.UserToken 2.userid
            Login(loginname, password, deviceid, devicetype, ipaddress, authcode, authtoken) {
                return this.Invoke(0, (prxBase) => {
                    let proxy = LXGrid.Enterprise.Auth.IObjectEnterpriseAuthPrx.uncheckedCast(prxBase);
                    return proxy.Login(loginname, password, deviceid, devicetype, ipaddress, authcode, authtoken);
                });
            }

            // 退出登录
            // @参数 1..UserToken
            // @返回 无
            Logout(usertoken) {
                return this.Invoke(0, (prxBase) => {
                    let proxy = LXGrid.Enterprise.Auth.IObjectEnterpriseAuthPrx.uncheckedCast(prxBase);
                    return proxy.Logout(usertoken);
                });
            }

            // 修改密码
            // @参数 1.登录名 2.验证码 3.验证识别码 4.新密码 
            // @返回 无
            ChangePassword(loginname, authcode, authtoken, password) {
                return this.Invoke(0, (prxBase) => {
                    let proxy = LXGrid.Enterprise.Auth.IObjectEnterpriseAuthPrx.uncheckedCast(prxBase);
                    return proxy.ChangePassword(loginname, authcode, authtoken, password);
                });
            }

            // 重置用户密码
            // @参数 1.当前用户ID 2.用户ID
            // @返回 无
            ResetPassword(userid) {
                return this.Invoke(0, (prxBase) => {
                    let proxy = LXGrid.Enterprise.Auth.IObjectEnterpriseAuthPrx.uncheckedCast(prxBase);
                    return proxy.ResetPassword(userid);
                });
            }

            // 修改手机号
            // @参数 1.usertoken 2.新手机号 3.验证码1 4.验证识别码1 5.验证码2 6.验证识别码2
            // @返回 无
            ChangePhoneNumber(usertoken, phone, authcode, authtoken, authcode2, authtoken2) {
                return this.Invoke(0, (prxBase) => {
                    let proxy = LXGrid.Enterprise.Auth.IObjectEnterpriseAuthPrx.uncheckedCast(prxBase);
                    return proxy.ChangePhoneNumber(usertoken, phone, authcode, authtoken, authcode2, authtoken2);
                });
            }

            // 获取短信验证码
            // @参数 1.用户令牌
            // @返回 1.authtoken
            SendSMSCodeByToken(usertoken, phone) {
                return this.Invoke(0, (prxBase) => {
                    let proxy = LXGrid.Enterprise.Auth.IObjectEnterpriseAuthPrx.uncheckedCast(prxBase);
                    return proxy.SendSMSCodeByToken(usertoken, phone);
                });
            }

            // 获取短信验证码
            // @参数 1.登录名 2.新手机号
            // @返回 1.authtoken
            SendSMSCodeByLoginname(loginname) {
                return this.Invoke(0, (prxBase) => {
                    let proxy = LXGrid.Enterprise.Auth.IObjectEnterpriseAuthPrx.uncheckedCast(prxBase);
                    return proxy.SendSMSCodeByLoginname(loginname);
                });
            }

            // 生成密码令牌
            // @参数 1.用户ID 2.用户密码
            // @返回 1.SecurityToken
            GetSecurityToken(userid, password) {
                return this.Invoke(0, (prxBase) => {
                    let proxy = LXGrid.Enterprise.Auth.IObjectEnterpriseAuthPrx.uncheckedCast(prxBase);
                    return proxy.GetSecurityToken(userid, password);
                });
            }

            // 密码令牌校验
            // @参数 1.用户ID 2.SecurityToken
            // @返回 
            CheckSecurityToken(userid, securitytoken) {
                return this.Invoke(0, (prxBase) => {
                    let proxy = LXGrid.Enterprise.Auth.IObjectEnterpriseAuthPrx.uncheckedCast(prxBase);
                    return proxy.CheckSecurityToken(userid, securitytoken);
                });
            }

            // 查询在线设备
            // @参数 1.用户ID
            // @返回 1.SJOnlineDeviceSeq
            GetOnlineStatus(userid) {
                return this.Invoke(0, (prxBase) => {
                    let proxy = LXGrid.Enterprise.Auth.IObjectEnterpriseAuthPrx.uncheckedCast(prxBase);
                    return proxy.GetOnlineStatus(userid);
                });
            }

            // 用户令牌校验
            // @参数 1.用户令牌
            // @返回 1.SJOnlineDevice 2.userid
            CheckUserToken(usertoken) {
                return this.Invoke(0, (prxBase) => {
                    let proxy = LXGrid.Enterprise.Auth.IObjectEnterpriseAuthPrx.uncheckedCast(prxBase);
                    return proxy.CheckUserToken(usertoken);
                });
            }

        };

        LXGrid.LXSliceInvokerEnterpriseAuth = LXSliceInvokerEnterpriseAuth;
        exports.LXGrid = LXGrid;
    }
    (typeof(global) !== 'undefined' && typeof(global.process) !== 'undefined' ? module : undefined,
        typeof(global) !== 'undefined' && typeof(global.process) !== 'undefined' ? require : window.Ice.__require,
        typeof(global) !== 'undefined' && typeof(global.process) !== 'undefined' ? exports : window));