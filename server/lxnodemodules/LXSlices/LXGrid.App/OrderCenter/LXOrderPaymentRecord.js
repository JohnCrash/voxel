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
// Generated from file `LXOrderPaymentRecord.ice'
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

    LXGrid.App.OrderCenter.LXOrderPaymentRecord = Slice.defineObject(
        function(payNo, masterNo, stageid, createTime, dealTime, payState, rmbAmount, goldAmount, leAmount)
        {
            Ice.Object.call(this);
            this.payNo = payNo !== undefined ? payNo : "";
            this.masterNo = masterNo !== undefined ? masterNo : "";
            this.stageid = stageid !== undefined ? stageid : 0;
            this.createTime = createTime !== undefined ? createTime : 0;
            this.dealTime = dealTime !== undefined ? dealTime : 0;
            this.payState = payState !== undefined ? payState : 0;
            this.rmbAmount = rmbAmount !== undefined ? rmbAmount : 0;
            this.goldAmount = goldAmount !== undefined ? goldAmount : 0;
            this.leAmount = leAmount !== undefined ? leAmount : 0;
        },
        Ice.Object, undefined, 1,
        [
            "::Ice::Object",
            "::LXGrid::App::OrderCenter::LXOrderPaymentRecord"
        ],
        -1,
        function(__os)
        {
            __os.writeString(this.payNo);
            __os.writeString(this.masterNo);
            __os.writeInt(this.stageid);
            __os.writeLong(this.createTime);
            __os.writeLong(this.dealTime);
            __os.writeInt(this.payState);
            __os.writeInt(this.rmbAmount);
            __os.writeInt(this.goldAmount);
            __os.writeInt(this.leAmount);
        },
        function(__is)
        {
            this.payNo = __is.readString();
            this.masterNo = __is.readString();
            this.stageid = __is.readInt();
            this.createTime = __is.readLong();
            this.dealTime = __is.readLong();
            this.payState = __is.readInt();
            this.rmbAmount = __is.readInt();
            this.goldAmount = __is.readInt();
            this.leAmount = __is.readInt();
        },
        false);

    LXGrid.App.OrderCenter.LXOrderPaymentRecordPrx = Slice.defineProxy(Ice.ObjectPrx, LXGrid.App.OrderCenter.LXOrderPaymentRecord.ice_staticId, undefined);

    Slice.defineOperations(LXGrid.App.OrderCenter.LXOrderPaymentRecord, LXGrid.App.OrderCenter.LXOrderPaymentRecordPrx);
    Slice.defineSequence(LXGrid.App.OrderCenter, "LXOrderPaymentRecordSeqHelper", "Ice.ObjectHelper", false, "LXGrid.App.OrderCenter.LXOrderPaymentRecord");
    exports.LXGrid = LXGrid;
}
(typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? module : undefined,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? require : window.Ice.__require,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? exports : window));
