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
// Generated from file `LXSliceQuestionnaireBase.ice'
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
        "LXGrid.App/Questionnaire/LXSliceQuestionnaireDefine"
    ]).LXGrid;
    
    var Slice = Ice.Slice;

    LXGrid.App = __M.module("LXGrid.App");

    LXGrid.App.Questionnaire = __M.module("LXGrid.App.Questionnaire");

    Object.defineProperty(LXGrid.App.Questionnaire, 'IObjectQuestionnaireBaseName', {
        value: "IObjectQuestionnaireBase"
    });

    LXGrid.App.Questionnaire.IObjectQuestionnaireBase = Slice.defineObject(
        undefined,
        Ice.Object,
        [
            LXGrid.Common.IObjectBase
        ], 1,
        [
            "::Ice::Object",
            "::LXGrid::App::Questionnaire::IObjectQuestionnaireBase",
            "::LXGrid::Common::IObjectBase"
        ],
        -1, undefined, undefined, false);

    LXGrid.App.Questionnaire.IObjectQuestionnaireBasePrx = Slice.defineProxy(Ice.ObjectPrx, LXGrid.App.Questionnaire.IObjectQuestionnaireBase.ice_staticId, [
        LXGrid.Common.IObjectBasePrx]);

    Slice.defineOperations(LXGrid.App.Questionnaire.IObjectQuestionnaireBase, LXGrid.App.Questionnaire.IObjectQuestionnaireBasePrx,
    {
        "GetQuestList": [, , , , , [LXGrid.Common.LXReturn], [[7], [4], [4], [3], [3], [3], [3], [3], [3]], [[3], ["Ice.StringSeqHelper"]], , , ],
        "GetUserQuestIDList": [, , , , , [LXGrid.Common.LXReturn], [[3], [3], [3]], [[3], ["Ice.StringSeqHelper"]], , , ],
        "GetUserPublishIDList": [, , , , , [LXGrid.Common.LXReturn], [[3], [3], [3]], [[3], ["Ice.StringSeqHelper"]], , , ],
        "GetQuestInfo": [, , , 1, , [LXGrid.Common.LXReturn], [[7]], [["LXGrid.App.Questionnaire.LXQuest", true]], , , true],
        "GetQuestScope": [, , , , , [LXGrid.Common.LXReturn], [[7]], [["LXGrid.App.Questionnaire.LXScope", true]], , , true],
        "GetQuestionCount": [, , , , , [LXGrid.Common.LXReturn], [[7]], [[3]], , , ],
        "GetQuestionList": [, , , , , [LXGrid.Common.LXReturn], [[7]], [["LXGrid.App.Questionnaire.LXQuestionSeqHelper"]], , , true],
        "GetSubmitStatus": [, , , , , [LXGrid.Common.LXReturn], [[3], [7], [7]], [["LXGrid.App.Questionnaire.LXSubmitStatus", true]], , , true],
        "GetSubmitUserIDList": [, , , , , [LXGrid.Common.LXReturn], [[7], [3], [3]], [[3], ["Ice.IntSeqHelper"]], , , ],
        "GetQuestBlankList": [, , , , , [LXGrid.Common.LXReturn], [[7], [3], [3], [3]], [[3], ["LXGrid.App.Questionnaire.LXUserBlankSeqHelper"]], , , true],
        "GetUserAnswer": [, , , , , [LXGrid.Common.LXReturn], [[7], [3]], [["LXGrid.App.Questionnaire.LXAnswerSeqHelper"], [4]], , , true],
        "PublishQuest": [, , , 1, , [LXGrid.Common.LXReturn], [[3], [7], [7], [7], [7], ["LXGrid.App.Questionnaire.LXOption", true], ["LXGrid.App.Questionnaire.LXScope", true], ["LXGrid.App.Questionnaire.LXQuestionSeqHelper"]], [[7]], , true, ],
        "SubmitAnswer": [, , , 1, , [LXGrid.Common.LXReturn], [[3], [7], [7], ["LXGrid.App.Questionnaire.LXAnswerSeqHelper"]], , , true, ],
        "DeleteQuest": [, , , 1, , [LXGrid.Common.LXReturn], [[3], [7]], , , , ]
    });
    exports.LXGrid = LXGrid;
}
(typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? module : undefined,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? require : window.Ice.__require,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? exports : window));