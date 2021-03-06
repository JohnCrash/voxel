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
// Generated from file `LXOrderNotifyMerchantLog.ice'
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

    LXGrid.App.OrderCenter.LXOrderNotifyMerchantLog = Slice.defineObject(
        function(notifylog, masterNo, appid, paras, state, notifyTime)
        {
            Ice.Object.call(this);
            this.notifylog = notifylog !== undefined ? notifylog : 0;
            this.masterNo = masterNo !== undefined ? masterNo : "";
            this.appid = appid !== undefined ? appid : 0;
            this.paras = paras !== undefined ? paras : "";
            this.state = state !== undefined ? state : 0;
            this.notifyTime = notifyTime !== undefined ? notifyTime : 0;
        },
        Ice.Object, undefined, 1,
        [
            "::Ice::Object",
            "::LXGrid::App::OrderCenter::LXOrderNotifyMerchantLog"
        ],
        -1,
        function(__os)
        {
            __os.writeLong(this.notifylog);
            __os.writeString(this.masterNo);
            __os.writeInt(this.appid);
            __os.writeString(this.paras);
            __os.writeInt(this.state);
            __os.writeLong(this.notifyTime);
        },
        function(__is)
        {
            this.notifylog = __is.readLong();
            this.masterNo = __is.readString();
            this.appid = __is.readInt();
            this.paras = __is.readString();
            this.state = __is.readInt();
            this.notifyTime = __is.readLong();
        },
        false);

    LXGrid.App.OrderCenter.LXOrderNotifyMerchantLogPrx = Slice.defineProxy(Ice.ObjectPrx, LXGrid.App.OrderCenter.LXOrderNotifyMerchantLog.ice_staticId, undefined);

    Slice.defineOperations(LXGrid.App.OrderCenter.LXOrderNotifyMerchantLog, LXGrid.App.OrderCenter.LXOrderNotifyMerchantLogPrx);
    Slice.defineSequence(LXGrid.App.OrderCenter, "LXOrderNotifyMerchantLogSeqHelper", "Ice.ObjectHelper", false, "LXGrid.App.OrderCenter.LXOrderNotifyMerchantLog");
    exports.LXGrid = LXGrid;
}
(typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? module : undefined,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? require : window.Ice.__require,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? exports : window));
