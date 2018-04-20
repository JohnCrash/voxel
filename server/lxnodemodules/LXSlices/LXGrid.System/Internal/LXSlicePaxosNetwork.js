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
// Generated from file `LXSlicePaxosNetwork.ice'
//
// Warning: do not edit this file.
//
// </auto-generated>
//

(function(module, require, exports)
{
    var Ice = require("ice").Ice;
    var __M = Ice.__M;
    var LXGrid = require("LXGrid.System/LXSliceBase").LXGrid;
    var Slice = Ice.Slice;

    LXGrid.System = __M.module("LXGrid.System");

    LXGrid.System.IObjectPaxosNetwork = Slice.defineObject(
        undefined,
        Ice.Object, undefined, 1,
        [
            "::Ice::Object",
            "::LXGrid::System::IObjectPaxosNetwork"
        ],
        -1, undefined, undefined, false);

    LXGrid.System.IObjectPaxosNetworkPrx = Slice.defineProxy(Ice.ObjectPrx, LXGrid.System.IObjectPaxosNetwork.ice_staticId, undefined);

    Slice.defineOperations(LXGrid.System.IObjectPaxosNetwork, LXGrid.System.IObjectPaxosNetworkPrx,
    {
        "SendMessage": [, , , , , , [["Ice.ByteSeqHelper"]], , , , ]
    });
    exports.LXGrid = LXGrid;
}
(typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? module : undefined,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? require : window.Ice.__require,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? exports : window));
