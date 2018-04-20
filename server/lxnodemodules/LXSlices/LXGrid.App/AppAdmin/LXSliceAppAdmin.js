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
// Generated from file `LXSliceAppAdmin.ice'
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
        "LXGrid.App/AppAdmin/LXSliceAppAdminDefine"
    ]).LXGrid;
    
    var Slice = Ice.Slice;

    LXGrid.App = __M.module("LXGrid.App");

    LXGrid.App.AppAdmin = __M.module("LXGrid.App.AppAdmin");

    Object.defineProperty(LXGrid.App.AppAdmin, 'IObjectAppAdminName', {
        value: "IObjectAppAdmin"
    });

    LXGrid.App.AppAdmin.IObjectAppAdmin = Slice.defineObject(
        undefined,
        Ice.Object,
        [
            LXGrid.Common.IObjectBase
        ], 1,
        [
            "::Ice::Object",
            "::LXGrid::App::AppAdmin::IObjectAppAdmin",
            "::LXGrid::Common::IObjectBase"
        ],
        -1, undefined, undefined, false);

    LXGrid.App.AppAdmin.IObjectAppAdminPrx = Slice.defineProxy(Ice.ObjectPrx, LXGrid.App.AppAdmin.IObjectAppAdmin.ice_staticId, [
        LXGrid.Common.IObjectBasePrx]);

    Slice.defineOperations(LXGrid.App.AppAdmin.IObjectAppAdmin, LXGrid.App.AppAdmin.IObjectAppAdminPrx,
    {
        "GetAppAdminList": [, , , , , [LXGrid.Common.LXReturn], [[3]], [["LXGrid.App.AppAdmin.LXAppAdminSeqHelper"]], , , true],
        "GetAdminAppList": [, , , , , [LXGrid.Common.LXReturn], [[3]], [["LXGrid.App.AppAdmin.LXAppAdminSeqHelper"]], , , true],
        "SetAppAdmin": [, , , 1, , [LXGrid.Common.LXReturn], [[3], [3], [3], ["Ice.IntSeqHelper"]], , , , ],
        "DelAppAdmin": [, , , 1, , [LXGrid.Common.LXReturn], [[3], [3]], , , , ],
        "CheckAppAdmin": [, , , 1, , [LXGrid.Common.LXReturn], [[3], [3], [3], [3]], , , , ]
    });
    exports.LXGrid = LXGrid;
}
(typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? module : undefined,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? require : window.Ice.__require,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? exports : window));
