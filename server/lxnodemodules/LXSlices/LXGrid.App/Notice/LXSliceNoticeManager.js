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
// Generated from file `LXSliceNoticeManager.ice'
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
        "LXGrid.Common/LXSliceDefine",
        "LXGrid.App/Notice/LXSliceNoticeDefine"
    ]).LXGrid;
    
    var Slice = Ice.Slice;

    LXGrid.App = __M.module("LXGrid.App");

    LXGrid.App.Notice = __M.module("LXGrid.App.Notice");

    Object.defineProperty(LXGrid.App.Notice, 'IObjectNoticeManagerName', {
        value: "IObjectNoticeManager"
    });

    LXGrid.App.Notice.IObjectNoticeManager = Slice.defineObject(
        undefined,
        Ice.Object,
        [
            LXGrid.Common.IObjectBase
        ], 1,
        [
            "::Ice::Object",
            "::LXGrid::App::Notice::IObjectNoticeManager",
            "::LXGrid::Common::IObjectBase"
        ],
        -1, undefined, undefined, false);

    LXGrid.App.Notice.IObjectNoticeManagerPrx = Slice.defineProxy(Ice.ObjectPrx, LXGrid.App.Notice.IObjectNoticeManager.ice_staticId, [
        LXGrid.Common.IObjectBasePrx]);

    Slice.defineOperations(LXGrid.App.Notice.IObjectNoticeManager, LXGrid.App.Notice.IObjectNoticeManagerPrx,
    {
        "GetNoticeOutBoxList": [, , , , , [LXGrid.Common.LXReturn], [[3]], [["LXGrid.App.Notice.LXNoticeInfoSeqHelper"]], , , true],
        "GetNoticeInBoxList": [, , , , , [LXGrid.Common.LXReturn], [[3]], [["LXGrid.App.Notice.LXNoticeInfoSeqHelper"]], , , true],
        "DelectNotice": [, , , 1, , [LXGrid.Common.LXReturn], [[7], [3]], [[3]], , , ],
        "GetNoticeReadUsers": [, , , , , [LXGrid.Common.LXReturn], [[7], [3]], [["LXGrid.App.Notice.LXNoticeUserSeqHelper"]], , , true],
        "GetNoticeZoneByLevel": [, , , , , [LXGrid.Common.LXReturn], [[7], [3], [3]], [["LXGrid.App.Notice.LXNoticeZoneStatSeqHelper"]], , , true],
        "NewNotice": [, , , , , [LXGrid.Common.LXReturn], [[3], ["LXGrid.App.Notice.LXNoticeInfo", true]], , , true, ],
        "SetCarouselImages": [, , , 1, , [LXGrid.Common.LXReturn], [[3], [3], [7]], , , , ]
    });
    exports.LXGrid = LXGrid;
}
(typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? module : undefined,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? require : window.Ice.__require,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? exports : window));
