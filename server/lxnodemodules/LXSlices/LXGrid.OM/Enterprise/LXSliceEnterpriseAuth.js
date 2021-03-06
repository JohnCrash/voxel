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
// Generated from file `LXSliceEnterpriseAuth.ice'
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

    LXGrid.Enterprise.Auth = __M.module("LXGrid.Enterprise.Auth");

    Object.defineProperty(LXGrid.Enterprise.Auth, 'IObjectEnterpriseAuthName', {
        value: "IObjectEnterpriseAuth"
    });

    LXGrid.Enterprise.Auth.IObjectEnterpriseAuth = Slice.defineObject(
        undefined,
        Ice.Object,
        [
            LXGrid.Common.IObjectBase
        ], 2,
        [
            "::Ice::Object",
            "::LXGrid::Common::IObjectBase",
            "::LXGrid::Enterprise::Auth::IObjectEnterpriseAuth"
        ],
        -1, undefined, undefined, false);

    LXGrid.Enterprise.Auth.IObjectEnterpriseAuthPrx = Slice.defineProxy(Ice.ObjectPrx, LXGrid.Enterprise.Auth.IObjectEnterpriseAuth.ice_staticId, [
        LXGrid.Common.IObjectBasePrx]);

    Slice.defineOperations(LXGrid.Enterprise.Auth.IObjectEnterpriseAuth, LXGrid.Enterprise.Auth.IObjectEnterpriseAuthPrx,
    {
        "ActiveAccount": [, , , 1, , [LXGrid.Common.LXReturn], [[7], [7], [7], [7], [LXGrid.Enterprise.SJEnumDeviceType.__helper], [7], [7]], [[7], [3]], , , ],
        "Login": [, , , 1, , [LXGrid.Common.LXReturn], [[7], [7], [7], [LXGrid.Enterprise.SJEnumDeviceType.__helper], [7], [7], [7]], [[7], [3]], , , ],
        "Logout": [, , , 1, , [LXGrid.Common.LXReturn], [[7]], , , , ],
        "ChangePassword": [, , , 1, , [LXGrid.Common.LXReturn], [[7], [7], [7], [7]], , , , ],
        "ResetPassword": [, , , 1, , [LXGrid.Common.LXReturn], [[3]], , , , ],
        "ChangePhoneNumber": [, , , 1, , [LXGrid.Common.LXReturn], [[7], [7], [7], [7], [7], [7]], , , , ],
        "SendSMSCodeByToken": [, , , 1, , [LXGrid.Common.LXReturn], [[7], [7]], [[7]], , , ],
        "SendSMSCodeByLoginname": [, , , 1, , [LXGrid.Common.LXReturn], [[7]], [[7]], , , ],
        "GetSecurityToken": [, , , 1, , [LXGrid.Common.LXReturn], [[3], [7]], [[7]], , , ],
        "CheckSecurityToken": [, , , 1, , [LXGrid.Common.LXReturn], [[3], [7]], , , , ],
        "GetOnlineStatus": [, , , , , [LXGrid.Common.LXReturn], [[3]], [["LXGrid.Enterprise.SJOnlineDeviceSeqHelper"]], , , true],
        "CheckUserToken": [, , , , , [LXGrid.Common.LXReturn], [[7]], [["LXGrid.Enterprise.SJOnlineDevice", true], [3]], , , true]
    });

    Object.defineProperty(LXGrid.Enterprise.Auth, 'IObjectEnterpriseAppAuthName', {
        value: "IObjectEnterpriseAppAuth"
    });

    LXGrid.Enterprise.Auth.IObjectEnterpriseAppAuth = Slice.defineObject(
        undefined,
        Ice.Object,
        [
            LXGrid.Common.IObjectBase
        ], 2,
        [
            "::Ice::Object",
            "::LXGrid::Common::IObjectBase",
            "::LXGrid::Enterprise::Auth::IObjectEnterpriseAppAuth"
        ],
        -1, undefined, undefined, false);

    LXGrid.Enterprise.Auth.IObjectEnterpriseAppAuthPrx = Slice.defineProxy(Ice.ObjectPrx, LXGrid.Enterprise.Auth.IObjectEnterpriseAppAuth.ice_staticId, [
        LXGrid.Common.IObjectBasePrx]);

    Slice.defineOperations(LXGrid.Enterprise.Auth.IObjectEnterpriseAppAuth, LXGrid.Enterprise.Auth.IObjectEnterpriseAppAuthPrx,
    {
        "AppLogin": [, , , 1, , [LXGrid.Common.LXReturn], [[7], [3]], [[7]], , , ],
        "AppLogout": [, , , 1, , [LXGrid.Common.LXReturn], [[7]], , , , ],
        "GetOnlineStatus": [, , , , , [LXGrid.Common.LXReturn], [[3]], [["LXGrid.Enterprise.SJOnlineDeviceAppDictHelper"]], , , true],
        "CheckAccessToken": [, , , , , [LXGrid.Common.LXReturn], [[7]], [["LXGrid.Enterprise.SJOnlineApp", true], ["LXGrid.Enterprise.SJOnlineDevice", true], [3]], , , true]
    });
    exports.LXGrid = LXGrid;
}
(typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? module : undefined,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? require : window.Ice.__require,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? exports : window));
