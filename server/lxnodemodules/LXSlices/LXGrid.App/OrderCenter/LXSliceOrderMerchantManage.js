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
// Generated from file `LXSliceOrderMerchantManage.ice'
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
        "LXGrid.App/OrderCenter/LXSliceOrderDefine"
    ]).LXGrid;
    
    var Slice = Ice.Slice;

    LXGrid.App = __M.module("LXGrid.App");

    LXGrid.App.OrderCenter = __M.module("LXGrid.App.OrderCenter");

    Object.defineProperty(LXGrid.App.OrderCenter, 'IObjectOrderMerchantManageName', {
        value: "IObjectOrderMerchantManage"
    });

    LXGrid.App.OrderCenter.IObjectOrderMerchantManage = Slice.defineObject(
        undefined,
        Ice.Object,
        [
            LXGrid.Common.IObjectBase
        ], 1,
        [
            "::Ice::Object",
            "::LXGrid::App::OrderCenter::IObjectOrderMerchantManage",
            "::LXGrid::Common::IObjectBase"
        ],
        -1, undefined, undefined, false);

    LXGrid.App.OrderCenter.IObjectOrderMerchantManagePrx = Slice.defineProxy(Ice.ObjectPrx, LXGrid.App.OrderCenter.IObjectOrderMerchantManage.ice_staticId, [
        LXGrid.Common.IObjectBasePrx]);

    Slice.defineOperations(LXGrid.App.OrderCenter.IObjectOrderMerchantManage, LXGrid.App.OrderCenter.IObjectOrderMerchantManagePrx,
    {
        "RegMerchant": [, , , , , [LXGrid.Common.LXReturn], [[3], [7]], [[7]], , , ],
        "delMerchant": [, , , , , [LXGrid.Common.LXReturn], [[3], [7]], [[7]], , , ],
        "EditMerchant": [, , , , , [LXGrid.Common.LXReturn], [[3], [7]], [[7]], , , ],
        "GetMerchant": [, , , , , [LXGrid.Common.LXReturn], [[3], [7]], [[7]], , , ]
    });
    exports.LXGrid = LXGrid;
}
(typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? module : undefined,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? require : window.Ice.__require,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? exports : window));
