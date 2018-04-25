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
// Generated from file `LXSliceWordFilter.ice'
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

    LXGrid.Main = __M.module("LXGrid.Main");

    LXGrid.Main.WordFilter = __M.module("LXGrid.Main.WordFilter");

    Object.defineProperty(LXGrid.Main.WordFilter, 'IObjectName_WordFilter', {
        value: "IObjectWordFilter"
    });

    LXGrid.Main.WordFilter.IObjectWordFilter = Slice.defineObject(
        undefined,
        Ice.Object,
        [
            LXGrid.Common.IObjectBase
        ], 2,
        [
            "::Ice::Object",
            "::LXGrid::Common::IObjectBase",
            "::LXGrid::Main::WordFilter::IObjectWordFilter"
        ],
        -1, undefined, undefined, false);

    LXGrid.Main.WordFilter.IObjectWordFilterPrx = Slice.defineProxy(Ice.ObjectPrx, LXGrid.Main.WordFilter.IObjectWordFilter.ice_staticId, [
        LXGrid.Common.IObjectBasePrx]);

    Slice.defineOperations(LXGrid.Main.WordFilter.IObjectWordFilter, LXGrid.Main.WordFilter.IObjectWordFilterPrx,
    {
        "Check": [, , , , , [LXGrid.Common.LXReturn], [[7]], , , , ],
        "Filter": [, , , , , [LXGrid.Common.LXReturn], [[7]], [[7]], , , ],
        "FilterAndLog": [, , , 1, , [LXGrid.Common.LXReturn], [[3], [3], [7], [7]], [[7]], , , ]
    });
    exports.LXGrid = LXGrid;
}
(typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? module : undefined,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? require : window.Ice.__require,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? exports : window));