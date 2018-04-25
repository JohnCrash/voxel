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
// Generated from file `LXSliceSearch.ice'
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

    Object.defineProperty(LXGrid.Main.Search, 'IObjectName_Search', {
        value: "IObjectSearch"
    });

    LXGrid.Main.Search.IObjectSearch = Slice.defineObject(
        undefined,
        Ice.Object,
        [
            LXGrid.Common.IObjectBase
        ], 2,
        [
            "::Ice::Object",
            "::LXGrid::Common::IObjectBase",
            "::LXGrid::Main::Search::IObjectSearch"
        ],
        -1, undefined, undefined, false);

    LXGrid.Main.Search.IObjectSearchPrx = Slice.defineProxy(Ice.ObjectPrx, LXGrid.Main.Search.IObjectSearch.ice_staticId, [
        LXGrid.Common.IObjectBasePrx]);

    Slice.defineOperations(LXGrid.Main.Search.IObjectSearch, LXGrid.Main.Search.IObjectSearchPrx,
    {
        "Search": [, , , , , [LXGrid.Common.LXReturn], [[3], ["Ice.StringSeqHelper"], [3], [4], [4]], [["LXGrid.Main.Search.LXSearchResultSeqHelper"]], , , ]
    });
    exports.LXGrid = LXGrid;
}
(typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? module : undefined,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? require : window.Ice.__require,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? exports : window));