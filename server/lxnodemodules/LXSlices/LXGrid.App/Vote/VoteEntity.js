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
// Generated from file `VoteEntity.ice'
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

    LXGrid.App.ResultAnalysisItem = Slice.defineStruct(
        function(result, count)
        {
            this.result = result !== undefined ? result : "";
            this.count = count !== undefined ? count : 0;
        },
        true,
        function(__os)
        {
            __os.writeString(this.result);
            __os.writeInt(this.count);
        },
        function(__is)
        {
            this.result = __is.readString();
            this.count = __is.readInt();
        },
        5, 
        false);
    Slice.defineSequence(LXGrid.App, "ItemsHelper", "LXGrid.App.ResultAnalysisItem", false);

    LXGrid.App.ResultAnalysis = Slice.defineStruct(
        function(total, items)
        {
            this.total = total !== undefined ? total : 0;
            this.items = items !== undefined ? items : null;
        },
        true,
        function(__os)
        {
            __os.writeInt(this.total);
            LXGrid.App.ItemsHelper.write(__os, this.items);
        },
        function(__is)
        {
            this.total = __is.readInt();
            this.items = LXGrid.App.ItemsHelper.read(__is);
        },
        5, 
        false);

    LXGrid.App.VoteMainEntity = Slice.defineStruct(
        function(vm_id, title, description, voted_description, votedendtime, status, mode, result, app_id, action_id, resultanalysis)
        {
            this.vm_id = vm_id !== undefined ? vm_id : "";
            this.title = title !== undefined ? title : "";
            this.description = description !== undefined ? description : "";
            this.voted_description = voted_description !== undefined ? voted_description : "";
            this.votedendtime = votedendtime !== undefined ? votedendtime : 0;
            this.status = status !== undefined ? status : 0;
            this.mode = mode !== undefined ? mode : 0;
            this.result = result !== undefined ? result : "";
            this.app_id = app_id !== undefined ? app_id : "";
            this.action_id = action_id !== undefined ? action_id : "";
            this.resultanalysis = resultanalysis !== undefined ? resultanalysis : new LXGrid.App.ResultAnalysis();
        },
        true,
        function(__os)
        {
            __os.writeString(this.vm_id);
            __os.writeString(this.title);
            __os.writeString(this.description);
            __os.writeString(this.voted_description);
            __os.writeLong(this.votedendtime);
            __os.writeInt(this.status);
            __os.writeInt(this.mode);
            __os.writeString(this.result);
            __os.writeString(this.app_id);
            __os.writeString(this.action_id);
            LXGrid.App.ResultAnalysis.write(__os, this.resultanalysis);
        },
        function(__is)
        {
            this.vm_id = __is.readString();
            this.title = __is.readString();
            this.description = __is.readString();
            this.voted_description = __is.readString();
            this.votedendtime = __is.readLong();
            this.status = __is.readInt();
            this.mode = __is.readInt();
            this.result = __is.readString();
            this.app_id = __is.readString();
            this.action_id = __is.readString();
            this.resultanalysis = LXGrid.App.ResultAnalysis.read(__is, this.resultanalysis);
        },
        28, 
        false);

    LXGrid.App.VoteOptionEntity = Slice.defineStruct(
        function(contents, label, sequences, vm_id)
        {
            this.contents = contents !== undefined ? contents : "";
            this.label = label !== undefined ? label : "";
            this.sequences = sequences !== undefined ? sequences : 0;
            this.vm_id = vm_id !== undefined ? vm_id : "";
        },
        true,
        function(__os)
        {
            __os.writeString(this.contents);
            __os.writeString(this.label);
            __os.writeByte(this.sequences);
            __os.writeString(this.vm_id);
        },
        function(__is)
        {
            this.contents = __is.readString();
            this.label = __is.readString();
            this.sequences = __is.readByte();
            this.vm_id = __is.readString();
        },
        4, 
        false);
    Slice.defineSequence(LXGrid.App, "OptionsHelper", "LXGrid.App.VoteOptionEntity", false);

    LXGrid.App.AddVoteParam = Slice.defineStruct(
        function(appid, actionid, title, description, voteddescription, mode, voteendtime, options)
        {
            this.appid = appid !== undefined ? appid : "";
            this.actionid = actionid !== undefined ? actionid : "";
            this.title = title !== undefined ? title : "";
            this.description = description !== undefined ? description : "";
            this.voteddescription = voteddescription !== undefined ? voteddescription : "";
            this.mode = mode !== undefined ? mode : 0;
            this.voteendtime = voteendtime !== undefined ? voteendtime : "";
            this.options = options !== undefined ? options : null;
        },
        true,
        function(__os)
        {
            __os.writeString(this.appid);
            __os.writeString(this.actionid);
            __os.writeString(this.title);
            __os.writeString(this.description);
            __os.writeString(this.voteddescription);
            __os.writeInt(this.mode);
            __os.writeString(this.voteendtime);
            LXGrid.App.OptionsHelper.write(__os, this.options);
        },
        function(__is)
        {
            this.appid = __is.readString();
            this.actionid = __is.readString();
            this.title = __is.readString();
            this.description = __is.readString();
            this.voteddescription = __is.readString();
            this.mode = __is.readInt();
            this.voteendtime = __is.readString();
            this.options = LXGrid.App.OptionsHelper.read(__is);
        },
        11, 
        false);
    exports.LXGrid = LXGrid;
}
(typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? module : undefined,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? require : window.Ice.__require,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? exports : window));
