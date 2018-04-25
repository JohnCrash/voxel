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
// Generated from file `MatchStatisticsInfo.ice'
//
// Warning: do not edit this file.
//
// </auto-generated>
//

(function(module, require, exports)
{
    var Ice = require("ice").Ice;
    var __M = Ice.__M;
    var Slice = Ice.Slice;

    var LXGrid = __M.module("LXGrid");

    LXGrid.App = __M.module("LXGrid.App");

    LXGrid.App.PoemsMatch = __M.module("LXGrid.App.PoemsMatch");

    LXGrid.App.PoemsMatch.MatchStatisticsInfo = Slice.defineObject(
        function(JoinParents, JoinStudents, OnlineNumber)
        {
            Ice.Object.call(this);
            this.JoinParents = JoinParents !== undefined ? JoinParents : 0;
            this.JoinStudents = JoinStudents !== undefined ? JoinStudents : 0;
            this.OnlineNumber = OnlineNumber !== undefined ? OnlineNumber : 0;
        },
        Ice.Object, undefined, 1,
        [
            "::Ice::Object",
            "::LXGrid::App::PoemsMatch::MatchStatisticsInfo"
        ],
        -1,
        function(__os)
        {
            __os.writeInt(this.JoinParents);
            __os.writeInt(this.JoinStudents);
            __os.writeInt(this.OnlineNumber);
        },
        function(__is)
        {
            this.JoinParents = __is.readInt();
            this.JoinStudents = __is.readInt();
            this.OnlineNumber = __is.readInt();
        },
        false);

    LXGrid.App.PoemsMatch.MatchStatisticsInfoPrx = Slice.defineProxy(Ice.ObjectPrx, LXGrid.App.PoemsMatch.MatchStatisticsInfo.ice_staticId, undefined);

    Slice.defineOperations(LXGrid.App.PoemsMatch.MatchStatisticsInfo, LXGrid.App.PoemsMatch.MatchStatisticsInfoPrx);
    exports.LXGrid = LXGrid;
}
(typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? module : undefined,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? require : window.Ice.__require,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? exports : window));