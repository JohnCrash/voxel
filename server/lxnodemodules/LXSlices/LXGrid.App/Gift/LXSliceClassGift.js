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
// Generated from file `LXSliceClassGift.ice'
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
        "LXGrid.App/Gift/LXSliceGiftDefine"
    ]).LXGrid;
    
    var Slice = Ice.Slice;

    LXGrid.App = __M.module("LXGrid.App");

    LXGrid.App.Gift = __M.module("LXGrid.App.Gift");

    Object.defineProperty(LXGrid.App.Gift, 'IObjectClassGiftName', {
        value: "IObjectClassGift"
    });

    LXGrid.App.Gift.IObjectClassGift = Slice.defineObject(
        undefined,
        Ice.Object,
        [
            LXGrid.Common.IObjectBase
        ], 1,
        [
            "::Ice::Object",
            "::LXGrid::App::Gift::IObjectClassGift",
            "::LXGrid::Common::IObjectBase"
        ],
        -1, undefined, undefined, false);

    LXGrid.App.Gift.IObjectClassGiftPrx = Slice.defineProxy(Ice.ObjectPrx, LXGrid.App.Gift.IObjectClassGift.ice_staticId, [
        LXGrid.Common.IObjectBasePrx]);

    Slice.defineOperations(LXGrid.App.Gift.IObjectClassGift, LXGrid.App.Gift.IObjectClassGiftPrx,
    {
        "GetClassZoneGift": [, , , , , [LXGrid.Common.LXReturn], [[3]], [["LXGrid.App.Gift.LXMemberInfoSeqHelper"]], , , true],
        "ResetZoneGiftNum": [, , , , , [LXGrid.Common.LXReturn], [[3]], [[1]], , , ],
        "OnGiveGift": [, , , , , [LXGrid.Common.LXReturn], [[3], [3], [3]], , , , ]
    });
    exports.LXGrid = LXGrid;
}
(typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? module : undefined,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? require : window.Ice.__require,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? exports : window));