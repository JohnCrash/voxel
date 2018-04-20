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
// Generated from file `LXSliceStatisticsDefine.ice'
//
// Warning: do not edit this file.
//
// </auto-generated>
//

(function(module, require, exports)
{
    var Ice = require("ice").Ice;
    var __M = Ice.__M;
    var LXGrid = __M.require(module, 
    [
        "LXGrid.System/LXSliceBase",
        "LXGrid.OM/LXSliceGridDefine"
    ]).LXGrid;
    
    var Slice = Ice.Slice;

    LXGrid.Statistics = __M.module("LXGrid.Statistics");

    LXGrid.Statistics.SJMessageInfo = Slice.defineObject(
        function(appid, userid, devicetype, userrole, version, timenow, deviceid, host, path, ipaddress, timeuse)
        {
            Ice.Object.call(this);
            this.appid = appid !== undefined ? appid : 0;
            this.userid = userid !== undefined ? userid : 0;
            this.devicetype = devicetype !== undefined ? devicetype : 0;
            this.userrole = userrole !== undefined ? userrole : 0;
            this.version = version !== undefined ? version : 0;
            this.timenow = timenow !== undefined ? timenow : 0;
            this.deviceid = deviceid !== undefined ? deviceid : "";
            this.host = host !== undefined ? host : "";
            this.path = path !== undefined ? path : "";
            this.ipaddress = ipaddress !== undefined ? ipaddress : "";
            this.timeuse = timeuse !== undefined ? timeuse : 0;
        },
        Ice.Object, undefined, 1,
        [
            "::Ice::Object",
            "::LXGrid::Statistics::SJMessageInfo"
        ],
        -1,
        function(__os)
        {
            __os.writeInt(this.appid);
            __os.writeInt(this.userid);
            __os.writeInt(this.devicetype);
            __os.writeInt(this.userrole);
            __os.writeInt(this.version);
            __os.writeLong(this.timenow);
            __os.writeString(this.deviceid);
            __os.writeString(this.host);
            __os.writeString(this.path);
            __os.writeString(this.ipaddress);
            __os.writeLong(this.timeuse);
        },
        function(__is)
        {
            this.appid = __is.readInt();
            this.userid = __is.readInt();
            this.devicetype = __is.readInt();
            this.userrole = __is.readInt();
            this.version = __is.readInt();
            this.timenow = __is.readLong();
            this.deviceid = __is.readString();
            this.host = __is.readString();
            this.path = __is.readString();
            this.ipaddress = __is.readString();
            this.timeuse = __is.readLong();
        },
        false);

    LXGrid.Statistics.SJMessageInfoPrx = Slice.defineProxy(Ice.ObjectPrx, LXGrid.Statistics.SJMessageInfo.ice_staticId, undefined);

    Slice.defineOperations(LXGrid.Statistics.SJMessageInfo, LXGrid.Statistics.SJMessageInfoPrx);
    Slice.defineSequence(LXGrid.Statistics, "SJMessageInfoSeqHelper", "Ice.ObjectHelper", false, "LXGrid.Statistics.SJMessageInfo");
    exports.LXGrid = LXGrid;
}
(typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? module : undefined,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? require : window.Ice.__require,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? exports : window));
