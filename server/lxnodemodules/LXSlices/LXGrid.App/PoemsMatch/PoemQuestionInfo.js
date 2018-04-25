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
// Generated from file `PoemQuestionInfo.ice'
//
// Warning: do not edit this file.
//
// </auto-generated>
//

(function(module, require, exports)
{
    var Ice = require("ice").Ice;
    var __M = Ice.__M;
    var Slice = Ice.Slice;

    var LXGrid = __M.module("LXGrid");

    LXGrid.App = __M.module("LXGrid.App");

    LXGrid.App.PoemsMatch = __M.module("LXGrid.App.PoemsMatch");

    LXGrid.App.PoemsMatch.QuestionOption = Slice.defineObject(
        function(QuestionBankId, OptionValue, OptionMark)
        {
            Ice.Object.call(this);
            this.QuestionBankId = QuestionBankId !== undefined ? QuestionBankId : 0;
            this.OptionValue = OptionValue !== undefined ? OptionValue : "";
            this.OptionMark = OptionMark !== undefined ? OptionMark : "";
        },
        Ice.Object, undefined, 1,
        [
            "::Ice::Object",
            "::LXGrid::App::PoemsMatch::QuestionOption"
        ],
        -1,
        function(__os)
        {
            __os.writeInt(this.QuestionBankId);
            __os.writeString(this.OptionValue);
            __os.writeString(this.OptionMark);
        },
        function(__is)
        {
            this.QuestionBankId = __is.readInt();
            this.OptionValue = __is.readString();
            this.OptionMark = __is.readString();
        },
        false);

    LXGrid.App.PoemsMatch.QuestionOptionPrx = Slice.defineProxy(Ice.ObjectPrx, LXGrid.App.PoemsMatch.QuestionOption.ice_staticId, undefined);

    Slice.defineOperations(LXGrid.App.PoemsMatch.QuestionOption, LXGrid.App.PoemsMatch.QuestionOptionPrx);
    Slice.defineSequence(LXGrid.App.PoemsMatch, "QuestionOptionsHelper", "Ice.ObjectHelper", false, "LXGrid.App.PoemsMatch.QuestionOption");

    LXGrid.App.PoemsMatch.PoemQuestionInfo = Slice.defineObject(
        function(QuestionBankId, PoemsId, Diff, QuestionType, QuestionModelId, QuestionTitle, QuestionContent, CorrectAnswer)
        {
            Ice.Object.call(this);
            this.QuestionBankId = QuestionBankId !== undefined ? QuestionBankId : 0;
            this.PoemsId = PoemsId !== undefined ? PoemsId : 0;
            this.Diff = Diff !== undefined ? Diff : 0;
            this.QuestionType = QuestionType !== undefined ? QuestionType : 0;
            this.QuestionModelId = QuestionModelId !== undefined ? QuestionModelId : 0;
            this.QuestionTitle = QuestionTitle !== undefined ? QuestionTitle : "";
            this.QuestionContent = QuestionContent !== undefined ? QuestionContent : "";
            this.CorrectAnswer = CorrectAnswer !== undefined ? CorrectAnswer : "";
        },
        Ice.Object, undefined, 1,
        [
            "::Ice::Object",
            "::LXGrid::App::PoemsMatch::PoemQuestionInfo"
        ],
        -1,
        function(__os)
        {
            __os.writeInt(this.QuestionBankId);
            __os.writeInt(this.PoemsId);
            __os.writeInt(this.Diff);
            __os.writeInt(this.QuestionType);
            __os.writeInt(this.QuestionModelId);
            __os.writeString(this.QuestionTitle);
            __os.writeString(this.QuestionContent);
            __os.writeString(this.CorrectAnswer);
        },
        function(__is)
        {
            this.QuestionBankId = __is.readInt();
            this.PoemsId = __is.readInt();
            this.Diff = __is.readInt();
            this.QuestionType = __is.readInt();
            this.QuestionModelId = __is.readInt();
            this.QuestionTitle = __is.readString();
            this.QuestionContent = __is.readString();
            this.CorrectAnswer = __is.readString();
        },
        false);

    LXGrid.App.PoemsMatch.PoemQuestionInfoPrx = Slice.defineProxy(Ice.ObjectPrx, LXGrid.App.PoemsMatch.PoemQuestionInfo.ice_staticId, undefined);

    Slice.defineOperations(LXGrid.App.PoemsMatch.PoemQuestionInfo, LXGrid.App.PoemsMatch.PoemQuestionInfoPrx);
    exports.LXGrid = LXGrid;
}
(typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? module : undefined,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? require : window.Ice.__require,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? exports : window));