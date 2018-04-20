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
// Generated from file `LXSliceNewsCollect.ice'
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
        "LXGrid.App/News/LXSliceNewsDefine"
    ]).LXGrid;
    
    var Slice = Ice.Slice;

    LXGrid.App = __M.module("LXGrid.App");

    LXGrid.App.News = __M.module("LXGrid.App.News");

    Object.defineProperty(LXGrid.App.News, 'IObjectNewsCollectName', {
        value: "IObjectNewsCollect"
    });

    LXGrid.App.News.IObjectNewsCollect = Slice.defineObject(
        undefined,
        Ice.Object,
        [
            LXGrid.Common.IObjectBase
        ], 1,
        [
            "::Ice::Object",
            "::LXGrid::App::News::IObjectNewsCollect",
            "::LXGrid::Common::IObjectBase"
        ],
        -1, undefined, undefined, false);

    LXGrid.App.News.IObjectNewsCollectPrx = Slice.defineProxy(Ice.ObjectPrx, LXGrid.App.News.IObjectNewsCollect.ice_staticId, [
        LXGrid.Common.IObjectBasePrx]);

    Slice.defineOperations(LXGrid.App.News.IObjectNewsCollect, LXGrid.App.News.IObjectNewsCollectPrx,
    {
        "CollectNews": [, , , 1, , [LXGrid.Common.LXReturn], [[3], [7], [1]], , , , ],
        "GetCollectList": [, , , , , [LXGrid.Common.LXReturn], [[3]], [["LXGrid.App.News.LXChannelInfoSeqHelper"], ["LXGrid.App.News.LXColumnInfoSeqHelper"], ["LXGrid.App.News.LXNewsInfoSeqHelper"]], , , true],
        "GetCollectCount": [, , , , , [LXGrid.Common.LXReturn], [[3]], [[3]], , , ],
        "IsNewsCollect": [, , , , , [LXGrid.Common.LXReturn], [[3], [7]], , , , ]
    });
    exports.LXGrid = LXGrid;
}
(typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? module : undefined,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? require : window.Ice.__require,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? exports : window));
