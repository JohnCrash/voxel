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
// Generated from file `UserStatisticsInfo.ice'
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

    LXGrid.App.PoemsBattle = __M.module("LXGrid.App.PoemsBattle");

    LXGrid.App.PoemsBattle.UserTableOperat = Slice.defineEnum([
        ['Add', 0], ['_Delete', 1], ['Get', 2]]);

    LXGrid.App.PoemsBattle.UserBattleStat = Slice.defineObject(
        function(UserId, UserName, SchoolId, SchoolName, ClassId, ClassName, BattleTitle, Ranking, Score, WinNumber, LostNumber)
        {
            Ice.Object.call(this);
            this.UserId = UserId !== undefined ? UserId : 0;
            this.UserName = UserName !== undefined ? UserName : "";
            this.SchoolId = SchoolId !== undefined ? SchoolId : 0;
            this.SchoolName = SchoolName !== undefined ? SchoolName : "";
            this.ClassId = ClassId !== undefined ? ClassId : 0;
            this.ClassName = ClassName !== undefined ? ClassName : "";
            this.BattleTitle = BattleTitle !== undefined ? BattleTitle : "";
            this.Ranking = Ranking !== undefined ? Ranking : 0;
            this.Score = Score !== undefined ? Score : 0;
            this.WinNumber = WinNumber !== undefined ? WinNumber : 0;
            this.LostNumber = LostNumber !== undefined ? LostNumber : 0;
        },
        Ice.Object, undefined, 1,
        [
            "::Ice::Object",
            "::LXGrid::App::PoemsBattle::UserBattleStat"
        ],
        -1,
        function(__os)
        {
            __os.writeInt(this.UserId);
            __os.writeString(this.UserName);
            __os.writeInt(this.SchoolId);
            __os.writeString(this.SchoolName);
            __os.writeInt(this.ClassId);
            __os.writeString(this.ClassName);
            __os.writeString(this.BattleTitle);
            __os.writeInt(this.Ranking);
            __os.writeInt(this.Score);
            __os.writeInt(this.WinNumber);
            __os.writeInt(this.LostNumber);
        },
        function(__is)
        {
            this.UserId = __is.readInt();
            this.UserName = __is.readString();
            this.SchoolId = __is.readInt();
            this.SchoolName = __is.readString();
            this.ClassId = __is.readInt();
            this.ClassName = __is.readString();
            this.BattleTitle = __is.readString();
            this.Ranking = __is.readInt();
            this.Score = __is.readInt();
            this.WinNumber = __is.readInt();
            this.LostNumber = __is.readInt();
        },
        false);

    LXGrid.App.PoemsBattle.UserBattleStatPrx = Slice.defineProxy(Ice.ObjectPrx, LXGrid.App.PoemsBattle.UserBattleStat.ice_staticId, undefined);

    Slice.defineOperations(LXGrid.App.PoemsBattle.UserBattleStat, LXGrid.App.PoemsBattle.UserBattleStatPrx);
    exports.LXGrid = LXGrid;
}
(typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? module : undefined,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? require : window.Ice.__require,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? exports : window));
