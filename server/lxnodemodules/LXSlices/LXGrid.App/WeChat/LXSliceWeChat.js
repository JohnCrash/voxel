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
// Generated from file `LXSliceWeChat.ice'
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

    LXGrid.App = __M.module("LXGrid.App");

    LXGrid.App.WeChat = __M.module("LXGrid.App.WeChat");

    Object.defineProperty(LXGrid.App.WeChat, 'IObjectName_WeChatToken', {
        value: "IObjectWeChatToken"
    });

    LXGrid.App.WeChat.IObjectWeChatToken = Slice.defineObject(
        undefined,
        Ice.Object,
        [
            LXGrid.Common.IObjectMasterSlaveBase
        ], 1,
        [
            "::Ice::Object",
            "::LXGrid::App::WeChat::IObjectWeChatToken",
            "::LXGrid::Common::IObjectBase",
            "::LXGrid::Common::IObjectMasterSlaveBase"
        ],
        -1, undefined, undefined, false);

    LXGrid.App.WeChat.IObjectWeChatTokenPrx = Slice.defineProxy(Ice.ObjectPrx, LXGrid.App.WeChat.IObjectWeChatToken.ice_staticId, [
        LXGrid.Common.IObjectMasterSlaveBasePrx]);

    Slice.defineOperations(LXGrid.App.WeChat.IObjectWeChatToken, LXGrid.App.WeChat.IObjectWeChatTokenPrx,
    {
        "GetAccessToken": [, , , , , [LXGrid.Common.LXReturn], , [["LXGrid.Common.StringDictHelper"]], , , ]
    });

    Object.defineProperty(LXGrid.App.WeChat, 'IObjectName_WeChatGateway', {
        value: "IObjectWeChatGateway"
    });

    LXGrid.App.WeChat.IObjectWeChatGateway = Slice.defineObject(
        undefined,
        Ice.Object,
        [
            LXGrid.Common.IObjectBase
        ], 1,
        [
            "::Ice::Object",
            "::LXGrid::App::WeChat::IObjectWeChatGateway",
            "::LXGrid::Common::IObjectBase"
        ],
        -1, undefined, undefined, false);

    LXGrid.App.WeChat.IObjectWeChatGatewayPrx = Slice.defineProxy(Ice.ObjectPrx, LXGrid.App.WeChat.IObjectWeChatGateway.ice_staticId, [
        LXGrid.Common.IObjectBasePrx]);

    Slice.defineOperations(LXGrid.App.WeChat.IObjectWeChatGateway, LXGrid.App.WeChat.IObjectWeChatGatewayPrx,
    {
        "SendMsgAndWait": [, , , 1, , [LXGrid.Common.LXReturn], [[7], [7], [7]], [[7]], , , ],
        "SendMsg": [, , , 1, , [LXGrid.Common.LXReturn], [[7], [7], [7]], , , , ],
        "MassSendMsg": [, , , 1, , [LXGrid.Common.LXReturn], [[7], [7], ["Ice.StringSeqHelper"]], , , , ],
        "MassSendMsgEx": [, , , 1, , [LXGrid.Common.LXReturn], [[7], ["LXGrid.Common.StringDictHelper"]], , , , ]
    });
    exports.LXGrid = LXGrid;
}
(typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? module : undefined,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? require : window.Ice.__require,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? exports : window));
