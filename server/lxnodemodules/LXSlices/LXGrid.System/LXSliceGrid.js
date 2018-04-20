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
// Generated from file `LXSliceGrid.ice'
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
        "LXGrid.System/LXSliceCluster"
    ]).LXGrid;
    
    var Slice = Ice.Slice;

    LXGrid.System = __M.module("LXGrid.System");

    Object.defineProperty(LXGrid.System, 'IObjectGridName', {
        value: "IObjectGrid"
    });

    LXGrid.System.IObjectGrid = Slice.defineObject(
        undefined,
        Ice.Object,
        [
            LXGrid.Common.IObjectBase
        ], 2,
        [
            "::Ice::Object",
            "::LXGrid::Common::IObjectBase",
            "::LXGrid::System::IObjectGrid"
        ],
        -1, undefined, undefined, false);

    LXGrid.System.IObjectGridPrx = Slice.defineProxy(Ice.ObjectPrx, LXGrid.System.IObjectGrid.ice_staticId, [
        LXGrid.Common.IObjectBasePrx]);

    Slice.defineOperations(LXGrid.System.IObjectGrid, LXGrid.System.IObjectGridPrx,
    {
        "QueryClusterNodes": [, 2, 2, , , [LXGrid.Common.LXReturn], [[7], [7]], [["LXGrid.System.ObjectClusterSeqHelper"]], , , ]
    });
    exports.LXGrid = LXGrid;
}
(typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? module : undefined,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? require : window.Ice.__require,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? exports : window));
