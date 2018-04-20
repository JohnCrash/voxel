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
// Generated from file `LXOrderRefund.ice'
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

    LXGrid.App.OrderCenter.LXOrderRefund = Slice.defineObject(
        function(refundNo, masterNo, LXRmb, LXLe, LXGold, refundState, applyTime, reason)
        {
            Ice.Object.call(this);
            this.refundNo = refundNo !== undefined ? refundNo : "";
            this.masterNo = masterNo !== undefined ? masterNo : "";
            this.LXRmb = LXRmb !== undefined ? LXRmb : 0;
            this.LXLe = LXLe !== undefined ? LXLe : 0;
            this.LXGold = LXGold !== undefined ? LXGold : 0;
            this.refundState = refundState !== undefined ? refundState : 0;
            this.applyTime = applyTime !== undefined ? applyTime : 0;
            this.reason = reason !== undefined ? reason : "";
        },
        Ice.Object, undefined, 1,
        [
            "::Ice::Object",
            "::LXGrid::App::OrderCenter::LXOrderRefund"
        ],
        -1,
        function(__os)
        {
            __os.writeString(this.refundNo);
            __os.writeString(this.masterNo);
            __os.writeInt(this.LXRmb);
            __os.writeInt(this.LXLe);
            __os.writeInt(this.LXGold);
            __os.writeInt(this.refundState);
            __os.writeLong(this.applyTime);
            __os.writeString(this.reason);
        },
        function(__is)
        {
            this.refundNo = __is.readString();
            this.masterNo = __is.readString();
            this.LXRmb = __is.readInt();
            this.LXLe = __is.readInt();
            this.LXGold = __is.readInt();
            this.refundState = __is.readInt();
            this.applyTime = __is.readLong();
            this.reason = __is.readString();
        },
        false);

    LXGrid.App.OrderCenter.LXOrderRefundPrx = Slice.defineProxy(Ice.ObjectPrx, LXGrid.App.OrderCenter.LXOrderRefund.ice_staticId, undefined);

    Slice.defineOperations(LXGrid.App.OrderCenter.LXOrderRefund, LXGrid.App.OrderCenter.LXOrderRefundPrx);
    Slice.defineSequence(LXGrid.App.OrderCenter, "LXOrderRefundSeqHelper", "Ice.ObjectHelper", false, "LXGrid.App.OrderCenter.LXOrderRefund");
    exports.LXGrid = LXGrid;
}
(typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? module : undefined,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? require : window.Ice.__require,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? exports : window));
