// **********************************************************************
//
// Copyright (c) 2003-2015 ZeroC, Inc. All rights reserved.
//
// This copy of Ice is licensed to you under the terms described in the
// ICE_LICENSE file included in this distribution.
//
// **********************************************************************
//
// Ice version 3.6.1
//
// <auto-generated>
//
// Generated from file `LXSliceOrderDefine.ice'
//
// Warning: do not edit this file.
//
// </auto-generated>
//

(function(module, require, exports)
{
    var Ice = require("ice").Ice;
    var __M = Ice.__M;
    var LXGrid = require("LXGrid.Common/LXSliceDefine").LXGrid;
    var Slice = Ice.Slice;

    LXGrid.App = __M.module("LXGrid.App");

    LXGrid.App.OrderCenter = __M.module("LXGrid.App.OrderCenter");

    LXGrid.App.OrderCenter.LXEnumError = Slice.defineEnum([
        ['LXErrorOrdersNotExist', 5001], ['LXErrorOrderOverdue', 5002], ['LXErrorOrderPayed', 5003], ['LXErrorOrderPayedClosed', 5004], ['LXErrorOrderPayeddue', 5005]]);

    LXGrid.App.OrderCenter.LXEnumPayState = Slice.defineEnum([
        ['LXState_New', 10], ['LXState_PartialPayment', 11], ['LXState_Payed', 12], ['LXState_PayExpired', 13]]);

    LXGrid.App.OrderCenter.LXEnumAuditState = Slice.defineEnum([
        ['LXState_Apply', 20], ['LXState_AuditPass', 21], ['LXState_Refsing', 22]]);

    LXGrid.App.OrderCenter.LXEnumRefundState = Slice.defineEnum([
        ['LXEnumRefundState_Apply', 30], ['LXEnumRefundState_AuditPass', 31], ['LXEnumRefundState_Refsing', 32], ['LXEnumRefundState_Complete', 35]]);

    LXGrid.App.OrderCenter.LXEnumRetrurnGoods = Slice.defineEnum([
        ['LXEnumRetrurnGoodsState_Apply', 40], ['LXEnumRetrurnGoodsState_AuditPass', 41], ['LXEnumRetrurnGoodsState_Refsing', 42], ['LXEnumRetrurnGoodsState_Complete', 45]]);

    LXGrid.App.OrderCenter.LXEnumLogistics = Slice.defineEnum([
        ['PendingDelivery', 50], ['AlreadyShipped', 51], ['ConfirmReceipt', 52]]);

    LXGrid.App.OrderCenter.LXEnumNotifyStatus = Slice.defineEnum([
        ['LXEnumNotifyStatus_Normal', 0], ['LXEnumNotifyStatus_sucess', 1], ['LXEnumNotifyStatus_fail', 2]]);

    LXGrid.App.OrderCenter.LXEnumOrderBaseState = Slice.defineEnum([
        ['LXState_Pay', 10], ['LXState_OrderAudit', 20], ['LXState_RefundAudit', 30], ['LXState_ReturnGoodsAudit', 40], ['LXState_LXEnumLogistics', 50],
        ['LXState_Cancel', 90], ['LXState_TransactionClosed', 99], ['LXState_complete', 100]]);

    LXGrid.App.OrderCenter.LXEnumEventCode = Slice.defineEnum([
        ['LXEvent_SubmitOrder', 1], ['LXEvent_PayOrder', 2], ['LXEvent_UserCancelOrder', 3], ['LXEvent_CloseTransaction', 4], ['LXEvent_PaySucessNotify', 5],
        ['LXEvent_PayFailsNotify', 6], ['LXEvent_Delivergoods', 7], ['LXEvent_OrderAudit', 8], ['LXEvent_ApplyRefund', 9], ['LXEvent_ApplyRturnGoods', 10]]);

    LXGrid.App.OrderCenter.LXOrderPrice = Slice.defineObject(
        function(LXRmb, LXLe, LXGold)
        {
            Ice.Object.call(this);
            this.LXRmb = LXRmb !== undefined ? LXRmb : 0;
            this.LXLe = LXLe !== undefined ? LXLe : 0;
            this.LXGold = LXGold !== undefined ? LXGold : 0;
        },
        Ice.Object, undefined, 1,
        [
            "::Ice::Object",
            "::LXGrid::App::OrderCenter::LXOrderPrice"
        ],
        -1,
        function(__os)
        {
            __os.writeInt(this.LXRmb);
            __os.writeInt(this.LXLe);
            __os.writeInt(this.LXGold);
        },
        function(__is)
        {
            this.LXRmb = __is.readInt();
            this.LXLe = __is.readInt();
            this.LXGold = __is.readInt();
        },
        false);

    LXGrid.App.OrderCenter.LXOrderPricePrx = Slice.defineProxy(Ice.ObjectPrx, LXGrid.App.OrderCenter.LXOrderPrice.ice_staticId, undefined);

    Slice.defineOperations(LXGrid.App.OrderCenter.LXOrderPrice, LXGrid.App.OrderCenter.LXOrderPricePrx);

    LXGrid.App.OrderCenter.LXOrderMasterOrder = Slice.defineObject(
        function(masterNo, createTime, orderState, userId, appId, appcontext, totalLeAmount, totalRmbAmount, totalGoldAmount, describle, payType, subStageCount, subOrderCount, tag)
        {
            Ice.Object.call(this);
            this.masterNo = masterNo !== undefined ? masterNo : "";
            this.createTime = createTime !== undefined ? createTime : 0;
            this.orderState = orderState !== undefined ? orderState : 0;
            this.userId = userId !== undefined ? userId : 0;
            this.appId = appId !== undefined ? appId : 0;
            this.appcontext = appcontext !== undefined ? appcontext : "";
            this.totalLeAmount = totalLeAmount !== undefined ? totalLeAmount : 0;
            this.totalRmbAmount = totalRmbAmount !== undefined ? totalRmbAmount : 0;
            this.totalGoldAmount = totalGoldAmount !== undefined ? totalGoldAmount : 0;
            this.describle = describle !== undefined ? describle : "";
            this.payType = payType !== undefined ? payType : 0;
            this.subStageCount = subStageCount !== undefined ? subStageCount : 0;
            this.subOrderCount = subOrderCount !== undefined ? subOrderCount : 0;
            this.tag = tag !== undefined ? tag : 0;
        },
        Ice.Object, undefined, 1,
        [
            "::Ice::Object",
            "::LXGrid::App::OrderCenter::LXOrderMasterOrder"
        ],
        -1,
        function(__os)
        {
            __os.writeString(this.masterNo);
            __os.writeLong(this.createTime);
            __os.writeInt(this.orderState);
            __os.writeInt(this.userId);
            __os.writeInt(this.appId);
            __os.writeString(this.appcontext);
            __os.writeInt(this.totalLeAmount);
            __os.writeInt(this.totalRmbAmount);
            __os.writeInt(this.totalGoldAmount);
            __os.writeString(this.describle);
            __os.writeInt(this.payType);
            __os.writeInt(this.subStageCount);
            __os.writeInt(this.subOrderCount);
            __os.writeInt(this.tag);
        },
        function(__is)
        {
            this.masterNo = __is.readString();
            this.createTime = __is.readLong();
            this.orderState = __is.readInt();
            this.userId = __is.readInt();
            this.appId = __is.readInt();
            this.appcontext = __is.readString();
            this.totalLeAmount = __is.readInt();
            this.totalRmbAmount = __is.readInt();
            this.totalGoldAmount = __is.readInt();
            this.describle = __is.readString();
            this.payType = __is.readInt();
            this.subStageCount = __is.readInt();
            this.subOrderCount = __is.readInt();
            this.tag = __is.readInt();
        },
        false);

    LXGrid.App.OrderCenter.LXOrderMasterOrderPrx = Slice.defineProxy(Ice.ObjectPrx, LXGrid.App.OrderCenter.LXOrderMasterOrder.ice_staticId, undefined);

    Slice.defineOperations(LXGrid.App.OrderCenter.LXOrderMasterOrder, LXGrid.App.OrderCenter.LXOrderMasterOrderPrx);
    Slice.defineSequence(LXGrid.App.OrderCenter, "LXOrderMasterOrderSeqHelper", "Ice.ObjectHelper", false, "LXGrid.App.OrderCenter.LXOrderMasterOrder");

    LXGrid.App.OrderCenter.LXOrderProduct = Slice.defineObject(
        function(masterNo, subNo, proId, num, price, name, remark, procontext, originalLePrice, originalGoldPrice, originalrmbPrice, realLePrice, realGoldPrice, realrmbPrice, Supplier, audit, logistics)
        {
            Ice.Object.call(this);
            this.masterNo = masterNo !== undefined ? masterNo : "";
            this.subNo = subNo !== undefined ? subNo : "";
            this.proId = proId !== undefined ? proId : 0;
            this.num = num !== undefined ? num : 0;
            this.price = price !== undefined ? price : 0;
            this.name = name !== undefined ? name : "";
            this.remark = remark !== undefined ? remark : "";
            this.procontext = procontext !== undefined ? procontext : "";
            this.originalLePrice = originalLePrice !== undefined ? originalLePrice : 0;
            this.originalGoldPrice = originalGoldPrice !== undefined ? originalGoldPrice : 0;
            this.originalrmbPrice = originalrmbPrice !== undefined ? originalrmbPrice : 0;
            this.realLePrice = realLePrice !== undefined ? realLePrice : 0;
            this.realGoldPrice = realGoldPrice !== undefined ? realGoldPrice : 0;
            this.realrmbPrice = realrmbPrice !== undefined ? realrmbPrice : 0;
            this.Supplier = Supplier !== undefined ? Supplier : "";
            this.audit = audit !== undefined ? audit : 0;
            this.logistics = logistics !== undefined ? logistics : 0;
        },
        Ice.Object, undefined, 1,
        [
            "::Ice::Object",
            "::LXGrid::App::OrderCenter::LXOrderProduct"
        ],
        -1,
        function(__os)
        {
            __os.writeString(this.masterNo);
            __os.writeString(this.subNo);
            __os.writeInt(this.proId);
            __os.writeInt(this.num);
            __os.writeInt(this.price);
            __os.writeString(this.name);
            __os.writeString(this.remark);
            __os.writeString(this.procontext);
            __os.writeInt(this.originalLePrice);
            __os.writeInt(this.originalGoldPrice);
            __os.writeInt(this.originalrmbPrice);
            __os.writeInt(this.realLePrice);
            __os.writeInt(this.realGoldPrice);
            __os.writeInt(this.realrmbPrice);
            __os.writeString(this.Supplier);
            __os.writeInt(this.audit);
            __os.writeInt(this.logistics);
        },
        function(__is)
        {
            this.masterNo = __is.readString();
            this.subNo = __is.readString();
            this.proId = __is.readInt();
            this.num = __is.readInt();
            this.price = __is.readInt();
            this.name = __is.readString();
            this.remark = __is.readString();
            this.procontext = __is.readString();
            this.originalLePrice = __is.readInt();
            this.originalGoldPrice = __is.readInt();
            this.originalrmbPrice = __is.readInt();
            this.realLePrice = __is.readInt();
            this.realGoldPrice = __is.readInt();
            this.realrmbPrice = __is.readInt();
            this.Supplier = __is.readString();
            this.audit = __is.readInt();
            this.logistics = __is.readInt();
        },
        false);

    LXGrid.App.OrderCenter.LXOrderProductPrx = Slice.defineProxy(Ice.ObjectPrx, LXGrid.App.OrderCenter.LXOrderProduct.ice_staticId, undefined);

    Slice.defineOperations(LXGrid.App.OrderCenter.LXOrderProduct, LXGrid.App.OrderCenter.LXOrderProductPrx);
    Slice.defineSequence(LXGrid.App.OrderCenter, "LXOrderProductSeqHelper", "Ice.ObjectHelper", false, "LXGrid.App.OrderCenter.LXOrderProduct");

    LXGrid.App.OrderCenter.LXOrderSubOrder = Slice.defineObject(
        function(subNo, masterNo, supplierName, subState, logistical, toexamine, subOriginalLeAmount, subOriginalGoldAmount, subOriginalrmbAmount, subRealLeAmount, subRealGoldAmount, subRealrmbAmount)
        {
            Ice.Object.call(this);
            this.subNo = subNo !== undefined ? subNo : "";
            this.masterNo = masterNo !== undefined ? masterNo : "";
            this.supplierName = supplierName !== undefined ? supplierName : "";
            this.subState = subState !== undefined ? subState : 0;
            this.logistical = logistical !== undefined ? logistical : 0;
            this.toexamine = toexamine !== undefined ? toexamine : 0;
            this.subOriginalLeAmount = subOriginalLeAmount !== undefined ? subOriginalLeAmount : 0;
            this.subOriginalGoldAmount = subOriginalGoldAmount !== undefined ? subOriginalGoldAmount : 0;
            this.subOriginalrmbAmount = subOriginalrmbAmount !== undefined ? subOriginalrmbAmount : 0;
            this.subRealLeAmount = subRealLeAmount !== undefined ? subRealLeAmount : 0;
            this.subRealGoldAmount = subRealGoldAmount !== undefined ? subRealGoldAmount : 0;
            this.subRealrmbAmount = subRealrmbAmount !== undefined ? subRealrmbAmount : 0;
        },
        Ice.Object, undefined, 1,
        [
            "::Ice::Object",
            "::LXGrid::App::OrderCenter::LXOrderSubOrder"
        ],
        -1,
        function(__os)
        {
            __os.writeString(this.subNo);
            __os.writeString(this.masterNo);
            __os.writeString(this.supplierName);
            __os.writeInt(this.subState);
            __os.writeInt(this.logistical);
            __os.writeInt(this.toexamine);
            __os.writeInt(this.subOriginalLeAmount);
            __os.writeInt(this.subOriginalGoldAmount);
            __os.writeInt(this.subOriginalrmbAmount);
            __os.writeInt(this.subRealLeAmount);
            __os.writeInt(this.subRealGoldAmount);
            __os.writeInt(this.subRealrmbAmount);
        },
        function(__is)
        {
            this.subNo = __is.readString();
            this.masterNo = __is.readString();
            this.supplierName = __is.readString();
            this.subState = __is.readInt();
            this.logistical = __is.readInt();
            this.toexamine = __is.readInt();
            this.subOriginalLeAmount = __is.readInt();
            this.subOriginalGoldAmount = __is.readInt();
            this.subOriginalrmbAmount = __is.readInt();
            this.subRealLeAmount = __is.readInt();
            this.subRealGoldAmount = __is.readInt();
            this.subRealrmbAmount = __is.readInt();
        },
        false);

    LXGrid.App.OrderCenter.LXOrderSubOrderPrx = Slice.defineProxy(Ice.ObjectPrx, LXGrid.App.OrderCenter.LXOrderSubOrder.ice_staticId, undefined);

    Slice.defineOperations(LXGrid.App.OrderCenter.LXOrderSubOrder, LXGrid.App.OrderCenter.LXOrderSubOrderPrx);
    Slice.defineSequence(LXGrid.App.OrderCenter, "LXOrderSubOrderSeqHelper", "Ice.ObjectHelper", false, "LXGrid.App.OrderCenter.LXOrderSubOrder");

    LXGrid.App.OrderCenter.LXOrderSubStages = Slice.defineObject(
        function(masterNo, stageId, leAmount, goldAmount, rmbAmount, startTime, deadlineTime, stageState)
        {
            Ice.Object.call(this);
            this.masterNo = masterNo !== undefined ? masterNo : "";
            this.stageId = stageId !== undefined ? stageId : 0;
            this.leAmount = leAmount !== undefined ? leAmount : 0;
            this.goldAmount = goldAmount !== undefined ? goldAmount : 0;
            this.rmbAmount = rmbAmount !== undefined ? rmbAmount : 0;
            this.startTime = startTime !== undefined ? startTime : 0;
            this.deadlineTime = deadlineTime !== undefined ? deadlineTime : 0;
            this.stageState = stageState !== undefined ? stageState : 0;
        },
        Ice.Object, undefined, 1,
        [
            "::Ice::Object",
            "::LXGrid::App::OrderCenter::LXOrderSubStages"
        ],
        -1,
        function(__os)
        {
            __os.writeString(this.masterNo);
            __os.writeLong(this.stageId);
            __os.writeInt(this.leAmount);
            __os.writeInt(this.goldAmount);
            __os.writeInt(this.rmbAmount);
            __os.writeLong(this.startTime);
            __os.writeLong(this.deadlineTime);
            __os.writeInt(this.stageState);
        },
        function(__is)
        {
            this.masterNo = __is.readString();
            this.stageId = __is.readLong();
            this.leAmount = __is.readInt();
            this.goldAmount = __is.readInt();
            this.rmbAmount = __is.readInt();
            this.startTime = __is.readLong();
            this.deadlineTime = __is.readLong();
            this.stageState = __is.readInt();
        },
        false);

    LXGrid.App.OrderCenter.LXOrderSubStagesPrx = Slice.defineProxy(Ice.ObjectPrx, LXGrid.App.OrderCenter.LXOrderSubStages.ice_staticId, undefined);

    Slice.defineOperations(LXGrid.App.OrderCenter.LXOrderSubStages, LXGrid.App.OrderCenter.LXOrderSubStagesPrx);
    Slice.defineSequence(LXGrid.App.OrderCenter, "LXOrderSubStagesSeqHelper", "Ice.ObjectHelper", false, "LXGrid.App.OrderCenter.LXOrderSubStages");
    exports.LXGrid = LXGrid;
}
(typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? module : undefined,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? require : window.Ice.__require,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? exports : window));