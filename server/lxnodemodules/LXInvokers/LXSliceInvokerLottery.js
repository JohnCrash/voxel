// LXInvokerBase
(function(module, require, exports) {
        const Ice = require('ice').Ice;
        LXGrid = Ice.__M.require(module, [
            'LXGrid.App/LXSliceGridAppDefine',
            'LXGrid.App/Lottery/LXSliceLotteryDefine',
            'LXGrid.App/Lottery/LXSliceLotteryDraw',
            '../LXGridBase/LXInvokerBase',
            '../LXGridBase/LXReturnHelper',
            '../LXGridBase/LXUtil'
        ]).LXGrid;

        const LXInvokerBase = LXGrid.LXInvokerBase;

        class LXSliceInvokerLottery extends LXInvokerBase {
            constructor(filename) {
                super(filename,LXGrid.App.ThisGridName,
                    LXGrid.App.ClusterNameLottery,
                    LXGrid.App.Lottery.IObjectLotteryDrawName);
            }

            // 获取抽奖活动信息
            GetLotteryDrawInfo(lotteryid, prizeid) {
                return this.Invoke(0, (prxBase) => {
                    let proxy = LXGrid.App.Lottery.IObjectLotteryDrawPrx.uncheckedCast(prxBase);
                    return proxy.GetLotteryDrawInfo(lotteryid);
                });
            }

            // 获取奖项信息
            GetPrizeInfo(lotteryid, prizeid) {
                return this.Invoke(0, (prxBase) => {
                    let proxy = LXGrid.App.Lottery.IObjectLotteryDrawPrx.uncheckedCast(prxBase);
                    return proxy.GetPrizeInfo(lotteryid, prizeid);
                });
            }

            // 获取兑奖信息
            GetCashInfo(ticketid) {
                return this.Invoke(0, (prxBase) => {
                    let proxy = LXGrid.App.Lottery.IObjectLotteryDrawPrx.uncheckedCast(prxBase);
                    return proxy.GetCashInfo(ticketid);
                });
            }

            // 管理接口
            // 创建抽奖活动
            CreateLotteryDraw(userid, comm, prizes) {
                return this.Invoke(0, (prxBase) => {
                    let proxy = LXGrid.App.Lottery.IObjectLotteryDrawPrx.uncheckedCast(prxBase);
                    return proxy.CreateLotteryDraw(userid, comm, prizes);
                });
            }

            // 修改抽奖信息
            ModifyLotteryDraw(lotteryid, comm, prizes) {
                return this.Invoke(0, (prxBase) => {
                    let proxy = LXGrid.App.Lottery.IObjectLotteryDrawPrx.uncheckedCast(prxBase);
                    return proxy.ModifyLotteryDraw(lotteryid, comm, prizes);
                });
            }

            // 删除抽奖活动
            DeleteLotteryDraw(lotteryid) {
                return this.Invoke(0, (prxBase) => {
                    let proxy = LXGrid.App.Lottery.IObjectLotteryDrawPrx.uncheckedCast(prxBase);
                    return proxy.DeleteLotteryDraw(lotteryid);
                });
            }

            // 获取抽奖活动列表
            GetLotteryDrawList(begin, count) {
                return this.Invoke(0, (prxBase) => {
                    let proxy = LXGrid.App.Lottery.IObjectLotteryDrawPrx.uncheckedCast(prxBase);
                    return proxy.GetLotteryDrawList(begin, count);
                });
            }

            // 设置中奖人
            SetTicketInfo(ticketid, ticket) {
                return this.Invoke(0, (prxBase) => {
                    let proxy = LXGrid.App.Lottery.IObjectLotteryDrawPrx.uncheckedCast(prxBase);
                    return proxy.SetTicketInfo(ticketid, ticket);
                });
            }

            // 添加抽奖券
            CreateTicket(lotteryid, userid) {
                return this.Invoke(0, (prxBase) => {
                    let proxy = LXGrid.App.Lottery.IObjectLotteryDrawPrx.uncheckedCast(prxBase);
                    return proxy.CreateTicket(lotteryid, userid);
                });
            }

            // 设置中奖人
            SetPresetTicket(lotteryid, prizeid, userid) {
                return this.Invoke(0, (prxBase) => {
                    let proxy = LXGrid.App.Lottery.IObjectLotteryDrawPrx.uncheckedCast(prxBase);
                    return proxy.SetPresetTicket(lotteryid, prizeid, userid);
                });
            }

            // 修改兑奖信息
            SetCashInfo(ticketid, state, cash) {
                return this.Invoke(0, (prxBase) => {
                    let proxy = LXGrid.App.Lottery.IObjectLotteryDrawPrx.uncheckedCast(prxBase);
                    return proxy.SetCashInfo(ticketid, state, cash);
                });
            }

            // 统计接口
            GetTicketStream(lotteryid, prizeid, userid, wintype, begin, count) {
                return this.Invoke(0, (prxBase) => {
                    let proxy = LXGrid.App.Lottery.IObjectLotteryDrawPrx.uncheckedCast(prxBase);
                    return proxy.GetTicketStream(lotteryid, prizeid, userid, wintype, begin, count);
                });
            }

            // 统计接口
            // 获取抽奖统计数量
            GetLotteryStatCount(lotteryid) {
                return this.Invoke(0, (prxBase) => {
                    let proxy = LXGrid.App.Lottery.IObjectLotteryDrawPrx.uncheckedCast(prxBase);
                    return proxy.GetLotteryStatCount(lotteryid);
                });
            }

            // 退还过期抽奖券兑换金币
            ReturnExpireExchangeTicket(lotteryid) {
                return this.Invoke(0, (prxBase) => {
                    let proxy = LXGrid.App.Lottery.IObjectLotteryDrawPrx.uncheckedCast(prxBase);
                    return proxy.ReturnExpireExchangeTicket(lotteryid);
                });
            }
        };

        LXGrid.LXSliceInvokerLottery = LXSliceInvokerLottery;
        exports.LXGrid = LXGrid;
    }
    (typeof(global) !== 'undefined' && typeof(global.process) !== 'undefined' ? module : undefined,
        typeof(global) !== 'undefined' && typeof(global.process) !== 'undefined' ? require : window.Ice.__require,
        typeof(global) !== 'undefined' && typeof(global.process) !== 'undefined' ? exports : window));