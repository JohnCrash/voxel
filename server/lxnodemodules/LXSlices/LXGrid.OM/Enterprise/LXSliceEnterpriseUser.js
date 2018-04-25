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
// Generated from file `LXSliceEnterpriseUser.ice'
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
        "LXGrid.OM/Enterprise/LXSliceEnterpriseDefine"
    ]).LXGrid;
    
    var Slice = Ice.Slice;

    LXGrid.Enterprise = __M.module("LXGrid.Enterprise");

    LXGrid.Enterprise.User = __M.module("LXGrid.Enterprise.User");

    Object.defineProperty(LXGrid.Enterprise.User, 'IObjectEnterpriseUserName', {
        value: "IObjectEnterpriseUser"
    });

    LXGrid.Enterprise.User.IObjectEnterpriseUser = Slice.defineObject(
        undefined,
        Ice.Object,
        [
            LXGrid.Common.IObjectBase
        ], 2,
        [
            "::Ice::Object",
            "::LXGrid::Common::IObjectBase",
            "::LXGrid::Enterprise::User::IObjectEnterpriseUser"
        ],
        -1, undefined, undefined, false);

    LXGrid.Enterprise.User.IObjectEnterpriseUserPrx = Slice.defineProxy(Ice.ObjectPrx, LXGrid.Enterprise.User.IObjectEnterpriseUser.ice_staticId, [
        LXGrid.Common.IObjectBasePrx]);

    Slice.defineOperations(LXGrid.Enterprise.User.IObjectEnterpriseUser, LXGrid.Enterprise.User.IObjectEnterpriseUserPrx,
    {
        "CreateAccount": [, , , 1, , [LXGrid.Common.LXReturn], [[3], [7]], [[3]], , , ],
        "SetAccountStatus": [, , , 1, , [LXGrid.Common.LXReturn], [[3], [3], [LXGrid.Enterprise.SJEnumAccountStatus.__helper]], , , , ],
        "RemoveAccount": [, , , 1, , [LXGrid.Common.LXReturn], [[3], [3]], , , , ],
        "SetAccountPhone": [, , , 1, , [LXGrid.Common.LXReturn], [[3], [3], [7]], , , , ],
        "ResetAccountPassword": [, , , 1, , [LXGrid.Common.LXReturn], [[3], [3]], , , , ],
        "SetAccountInfo": [, , , 1, , [LXGrid.Common.LXReturn], [[3], [3], ["LXGrid.Common.IntStringDictHelper"]], , , , ],
        "GetAccountList": [, , , , , [LXGrid.Common.LXReturn], [[3], [3]], [[3], ["Ice.IntSeqHelper"]], , , ],
        "GetAccountInfo": [, , , , , [LXGrid.Common.LXReturn], [[3]], [["LXGrid.Enterprise.SJUserInfo", true]], , , true],
        "GetAccountInfoSeq": [, , , , , [LXGrid.Common.LXReturn], [["Ice.IntSeqHelper"]], [["LXGrid.Enterprise.SJUserInfoSeqHelper"]], , , true],
        "SearchAccount": [, , , , , [LXGrid.Common.LXReturn], [[7]], [["Ice.IntSeqHelper"]], , , ]
    });
    exports.LXGrid = LXGrid;
}
(typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? module : undefined,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? require : window.Ice.__require,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? exports : window));