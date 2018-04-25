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
// Generated from file `LXSliceQuery.ice'
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
        "LXGrid.Main/Search/LXSliceSearchDefine"
    ]).LXGrid;
    
    var Slice = Ice.Slice;

    LXGrid.Main = __M.module("LXGrid.Main");

    LXGrid.Main.Search = __M.module("LXGrid.Main.Search");

    Object.defineProperty(LXGrid.Main.Search, 'IObjectName_Query', {
        value: "IObjectQuery"
    });

    LXGrid.Main.Search.IObjectQuery = Slice.defineObject(
        undefined,
        Ice.Object,
        [
            LXGrid.Common.IObjectBase
        ], 2,
        [
            "::Ice::Object",
            "::LXGrid::Common::IObjectBase",
            "::LXGrid::Main::Search::IObjectQuery"
        ],
        -1, undefined, undefined, false);

    LXGrid.Main.Search.IObjectQueryPrx = Slice.defineProxy(Ice.ObjectPrx, LXGrid.Main.Search.IObjectQuery.ice_staticId, [
        LXGrid.Common.IObjectBasePrx]);

    Slice.defineOperations(LXGrid.Main.Search.IObjectQuery, LXGrid.Main.Search.IObjectQueryPrx,
    {
        "Query": [, , , , , [LXGrid.Common.LXReturn], [[7], [3], [4], [4]], [["LXGrid.Main.Search.LXQueryResultSeqHelper"]], , , ]
    });
    exports.LXGrid = LXGrid;
}
(typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? module : undefined,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? require : window.Ice.__require,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? exports : window));