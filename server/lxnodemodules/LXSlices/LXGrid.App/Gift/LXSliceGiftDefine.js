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
// Generated from file `LXSliceGiftDefine.ice'
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

    LXGrid.App.Gift = __M.module("LXGrid.App.Gift");

    /**
     * 班级成员红花信息
     **/
    LXGrid.App.Gift.LXClassMemberInfo = Slice.defineObject(
        function(userid, gift_count)
        {
            Ice.Object.call(this);
            this.userid = userid !== undefined ? userid : 0;
            this.gift_count = gift_count !== undefined ? gift_count : 0;
        },
        Ice.Object, undefined, 1,
        [
            "::Ice::Object",
            "::LXGrid::App::Gift::LXClassMemberInfo"
        ],
        -1,
        function(__os)
        {
            __os.writeInt(this.userid);
            __os.writeInt(this.gift_count);
        },
        function(__is)
        {
            this.userid = __is.readInt();
            this.gift_count = __is.readInt();
        },
        false);

    LXGrid.App.Gift.LXClassMemberInfoPrx = Slice.defineProxy(Ice.ObjectPrx, LXGrid.App.Gift.LXClassMemberInfo.ice_staticId, undefined);

    Slice.defineOperations(LXGrid.App.Gift.LXClassMemberInfo, LXGrid.App.Gift.LXClassMemberInfoPrx);
    Slice.defineSequence(LXGrid.App.Gift, "LXMemberInfoSeqHelper", "Ice.ObjectHelper", false, "LXGrid.App.Gift.LXClassMemberInfo");

    /**
     * 红花
     **/
    LXGrid.App.Gift.LXUserGiftInfo = Slice.defineObject(
        function(src_user, dest_user, gift_num, add_time, reason, remark, app_reasonid, app_subid)
        {
            Ice.Object.call(this);
            this.src_user = src_user !== undefined ? src_user : 0;
            this.dest_user = dest_user !== undefined ? dest_user : 0;
            this.gift_num = gift_num !== undefined ? gift_num : 0;
            this.add_time = add_time !== undefined ? add_time : "";
            this.reason = reason !== undefined ? reason : "";
            this.remark = remark !== undefined ? remark : "";
            this.app_reasonid = app_reasonid !== undefined ? app_reasonid : 0;
            this.app_subid = app_subid !== undefined ? app_subid : "";
        },
        Ice.Object, undefined, 1,
        [
            "::Ice::Object",
            "::LXGrid::App::Gift::LXUserGiftInfo"
        ],
        -1,
        function(__os)
        {
            __os.writeInt(this.src_user);
            __os.writeInt(this.dest_user);
            __os.writeInt(this.gift_num);
            __os.writeString(this.add_time);
            __os.writeString(this.reason);
            __os.writeString(this.remark);
            __os.writeInt(this.app_reasonid);
            __os.writeString(this.app_subid);
        },
        function(__is)
        {
            this.src_user = __is.readInt();
            this.dest_user = __is.readInt();
            this.gift_num = __is.readInt();
            this.add_time = __is.readString();
            this.reason = __is.readString();
            this.remark = __is.readString();
            this.app_reasonid = __is.readInt();
            this.app_subid = __is.readString();
        },
        false);

    LXGrid.App.Gift.LXUserGiftInfoPrx = Slice.defineProxy(Ice.ObjectPrx, LXGrid.App.Gift.LXUserGiftInfo.ice_staticId, undefined);

    Slice.defineOperations(LXGrid.App.Gift.LXUserGiftInfo, LXGrid.App.Gift.LXUserGiftInfoPrx);
    Slice.defineSequence(LXGrid.App.Gift, "LXUserGiftInfoSeqHelper", "Ice.ObjectHelper", false, "LXGrid.App.Gift.LXUserGiftInfo");
    Slice.defineSequence(LXGrid.App.Gift, "LXUserStuIdSeqHelper", "Ice.IntHelper", true);
    exports.LXGrid = LXGrid;
}
(typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? module : undefined,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? require : window.Ice.__require,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? exports : window));
