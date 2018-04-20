// LXInvokerBase
(function(module, require, exports) {
        const Ice = require('ice').Ice;
        LXGrid = Ice.__M.require(module, [
            "LXGrid.OM/LXSliceGridDefine",
            "LXGrid.OM/Enterprise/LXSliceEnterpriseUser",
            '../LXGridBase/LXInvokerBase'
        ]).LXGrid;

        const LXInvokerBase = LXGrid.LXInvokerBase;

        class LXSliceInvokerEnterpriseUser extends LXInvokerBase {
            constructor(filename) {
                super(filename, LXGrid.ThisGridName, LXGrid.ClusterNameEnterpriseUser, LXGrid.Enterprise.User.IObjectEnterpriseUserName);
            }

            // 创建新用户
            // @参数 1.当前用户 2.登录名
            // @返回 1.LXReturn 2. 用户ID
            CreateAccount(opuid, loginname) {
                return this.Invoke(0, (prxBase) => {
                    let proxy = LXGrid.Enterprise.User.IObjectEnterpriseUserPrx.uncheckedCast(prxBase);
                    return proxy.CreateAccount(userid, loginname);
                });
            }

            // 设置用户状态
            // @参数 1.当前用户 2.用户ID 3.状态(SJEnumAccountStatus)
            // @返回 1.LXReturn 
            SetAccountStatus(opuid, userid, status) {
                return this.Invoke(0, (prxBase) => {
                    let proxy = LXGrid.Enterprise.User.IObjectEnterpriseUserPrx.uncheckedCast(prxBase);
                    return proxy.SetAccountStatus(opuid, userid, status);
                });
            }

            // 删除用户
            // @参数 1.当前用户 2.用户ID
            // @返回 1.LXReturn 
            RemoveAccount(opuid, userid) {
                return this.Invoke(0, (prxBase) => {
                    let proxy = LXGrid.Enterprise.User.IObjectEnterpriseUserPrx.uncheckedCast(prxBase);
                    return proxy.RemoveAccount(opuid, userid);
                });
            }

            // 修改用户手机号
            // @参数 1.当前用户 2.用户ID 3.手机号
            // @返回 1.LXReturn 
            SetAccountPhone(opuid, userid, phone) {
                return this.Invoke(0, (prxBase) => {
                    let proxy = LXGrid.Enterprise.User.IObjectEnterpriseUserPrx.uncheckedCast(prxBase);
                    return proxy.SetAccountPhone(opuid, userid, phone);
                });
            }

            // 重置用户密码
            // @参数 1.当前用户ID 2.用户ID
            // @返回 1.LXReturn 
            ResetAccountPassword(opuid, userid) {
                return this.Invoke(0, (prxBase) => {
                    let proxy = LXGrid.Enterprise.User.IObjectEnterpriseUserPrx.uncheckedCast(prxBase);
                    return proxy.ResetAccountPassword(opuid, userid);
                });
            }

            // 设置用户信息
            // @参数 1.当前用户ID 2.用户ID 3.修改目标字典<int, string>
            // @返回 1.LXReturn 
            SetAccountInfo(opuid, userid, target) {
                return this.Invoke(0, (prxBase) => {
                    let proxy = LXGrid.Enterprise.User.IObjectEnterpriseUserPrx.uncheckedCast(prxBase);
                    return proxy.SetAccountInfo(opuid, userid, target);
                });
            }

            // 获取用户列表
            // @参数 1.开始索引 2.数量
            // @返回 1.LXReturn 2.总数 3.用户ID列表
            GetAccountList(begin, count) {
                return this.Invoke(0, (prxBase) => {
                    let proxy = LXGrid.Enterprise.User.IObjectEnterpriseUserPrx.uncheckedCast(prxBase);
                    return proxy.GetAccountList(begin, count);
                });
            }

            // 获取用户信息
            // @参数 1.用户ID
            // @返回 1.LXReturn 2.用户信息(SJUserInfo)
            GetAccountInfo(userid) {
                return this.Invoke(0, (prxBase) => {
                    let proxy = LXGrid.Enterprise.User.IObjectEnterpriseUserPrx.uncheckedCast(prxBase);
                    return proxy.GetAccountInfo(userid);
                });
            }

            // 获取用户信息(批量)
            // @参数 1.用户ID数组
            // @返回 1.LXReturn 1.用户信息数组(SJUserInfoSeq)
            GetAccountInfoSeq(userids) {
                return this.Invoke(0, (prxBase) => {
                    let proxy = LXGrid.Enterprise.User.IObjectEnterpriseUserPrx.uncheckedCast(prxBase);
                    return proxy.GetAccountInfoSeq(userids);
                });
            }

            // 搜索用户
            // @参数 1.用户名
            // @返回 1.LXReturn 1.userids
            SearchAccount(name) {
                return this.Invoke(0, (prxBase) => {
                    let proxy = LXGrid.Enterprise.User.IObjectEnterpriseUserPrx.uncheckedCast(prxBase);
                    return proxy.SearchAccount(name);
                });
            }
        };

        LXGrid.LXSliceInvokerEnterpriseUser = LXSliceInvokerEnterpriseUser;
        exports.LXGrid = LXGrid;
    }
    (typeof(global) !== 'undefined' && typeof(global.process) !== 'undefined' ? module : undefined,
        typeof(global) !== 'undefined' && typeof(global.process) !== 'undefined' ? require : window.Ice.__require,
        typeof(global) !== 'undefined' && typeof(global.process) !== 'undefined' ? exports : window));