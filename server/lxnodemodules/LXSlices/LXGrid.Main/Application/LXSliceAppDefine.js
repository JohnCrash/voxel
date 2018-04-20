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
// Generated from file `LXSliceAppDefine.ice'
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
        "LXGrid.Main/Profile/LXSliceUserProfileDefine"
    ]).LXGrid;
    
    var Slice = Ice.Slice;

    LXGrid.Main = __M.module("LXGrid.Main");

    LXGrid.Main.Application = __M.module("LXGrid.Main.Application");

    LXGrid.Main.Application.LXEnumAppType = Slice.defineEnum([
        ['LXAPPType_Internal', 0], ['LXAPPType_External', 3]]);

    LXGrid.Main.Application.LXEnumAppState = Slice.defineEnum([
        ['LXAPPState_Normal', 0]]);

    LXGrid.Main.Application.LXAPPBaseInfoV2 = Slice.defineObject(
        function(app_name, app_intro, app_type, state, provider_id, notice, plugin, up_time)
        {
            Ice.Object.call(this);
            this.app_name = app_name !== undefined ? app_name : "";
            this.app_intro = app_intro !== undefined ? app_intro : "";
            this.app_type = app_type !== undefined ? app_type : 0;
            this.state = state !== undefined ? state : 0;
            this.provider_id = provider_id !== undefined ? provider_id : 0;
            this.notice = notice !== undefined ? notice : "";
            this.plugin = plugin !== undefined ? plugin : "";
            this.up_time = up_time;
        },
        Ice.Object, undefined, 1,
        [
            "::Ice::Object",
            "::LXGrid::Main::Application::LXAPPBaseInfoV2"
        ],
        -1,
        function(__os)
        {
            __os.writeString(this.app_name);
            __os.writeString(this.app_intro);
            __os.writeInt(this.app_type);
            __os.writeInt(this.state);
            __os.writeInt(this.provider_id);
            __os.writeString(this.notice);
            __os.writeString(this.plugin);
            Ice.LongHelper.writeOpt(__os, 1, this.up_time);
        },
        function(__is)
        {
            this.app_name = __is.readString();
            this.app_intro = __is.readString();
            this.app_type = __is.readInt();
            this.state = __is.readInt();
            this.provider_id = __is.readInt();
            this.notice = __is.readString();
            this.plugin = __is.readString();
            this.up_time = Ice.LongHelper.readOpt(__is, 1);
        },
        false);

    LXGrid.Main.Application.LXAPPBaseInfoV2Prx = Slice.defineProxy(Ice.ObjectPrx, LXGrid.Main.Application.LXAPPBaseInfoV2.ice_staticId, undefined);

    Slice.defineOperations(LXGrid.Main.Application.LXAPPBaseInfoV2, LXGrid.Main.Application.LXAPPBaseInfoV2Prx);
    Slice.defineSequence(LXGrid.Main.Application, "LXAPPBaseInfoSeqV2Helper", "Ice.ObjectHelper", false, "LXGrid.Main.Application.LXAPPBaseInfoV2");

    LXGrid.Main.Application.LXAPPCommonInfo = Slice.defineObject(
        function(start_time, end_time, devices, options, external)
        {
            Ice.Object.call(this);
            this.start_time = start_time !== undefined ? start_time : 0;
            this.end_time = end_time !== undefined ? end_time : 0;
            this.devices = devices !== undefined ? devices : "";
            this.options = options !== undefined ? options : "";
            this.external = external !== undefined ? external : "";
        },
        Ice.Object, undefined, 1,
        [
            "::Ice::Object",
            "::LXGrid::Main::Application::LXAPPCommonInfo"
        ],
        -1,
        function(__os)
        {
            __os.writeLong(this.start_time);
            __os.writeLong(this.end_time);
            __os.writeString(this.devices);
            __os.writeString(this.options);
            __os.writeString(this.external);
        },
        function(__is)
        {
            this.start_time = __is.readLong();
            this.end_time = __is.readLong();
            this.devices = __is.readString();
            this.options = __is.readString();
            this.external = __is.readString();
        },
        false);

    LXGrid.Main.Application.LXAPPCommonInfoPrx = Slice.defineProxy(Ice.ObjectPrx, LXGrid.Main.Application.LXAPPCommonInfo.ice_staticId, undefined);

    Slice.defineOperations(LXGrid.Main.Application.LXAPPCommonInfo, LXGrid.Main.Application.LXAPPCommonInfoPrx);
    Slice.defineSequence(LXGrid.Main.Application, "LXAPPCommonInfoSeqHelper", "Ice.ObjectHelper", false, "LXGrid.Main.Application.LXAPPCommonInfo");

    LXGrid.Main.Application.LXAPPUserInfoV2 = Slice.defineObject(
        function(app_name, app_intro, app_type, state, provider_id, notice, plugin, up_time, app_id, curr_version, min_version, min_shell_version, url, install_url)
        {
            LXGrid.Main.Application.LXAPPBaseInfoV2.call(this, app_name, app_intro, app_type, state, provider_id, notice, plugin, up_time);
            this.app_id = app_id !== undefined ? app_id : 0;
            this.curr_version = curr_version !== undefined ? curr_version : 0;
            this.min_version = min_version !== undefined ? min_version : 0;
            this.min_shell_version = min_shell_version !== undefined ? min_shell_version : 0;
            this.url = url !== undefined ? url : "";
            this.install_url = install_url !== undefined ? install_url : "";
        },
        LXGrid.Main.Application.LXAPPBaseInfoV2, undefined, 2,
        [
            "::Ice::Object",
            "::LXGrid::Main::Application::LXAPPBaseInfoV2",
            "::LXGrid::Main::Application::LXAPPUserInfoV2"
        ],
        -1,
        function(__os)
        {
            __os.writeInt(this.app_id);
            __os.writeInt(this.curr_version);
            __os.writeInt(this.min_version);
            __os.writeInt(this.min_shell_version);
            __os.writeString(this.url);
            __os.writeString(this.install_url);
        },
        function(__is)
        {
            this.app_id = __is.readInt();
            this.curr_version = __is.readInt();
            this.min_version = __is.readInt();
            this.min_shell_version = __is.readInt();
            this.url = __is.readString();
            this.install_url = __is.readString();
        },
        false);

    LXGrid.Main.Application.LXAPPUserInfoV2Prx = Slice.defineProxy(LXGrid.Main.Application.LXAPPBaseInfoV2Prx, LXGrid.Main.Application.LXAPPUserInfoV2.ice_staticId, undefined);

    Slice.defineOperations(LXGrid.Main.Application.LXAPPUserInfoV2, LXGrid.Main.Application.LXAPPUserInfoV2Prx);
    Slice.defineSequence(LXGrid.Main.Application, "LXAPPUserInfoSeqV2Helper", "Ice.ObjectHelper", false, "LXGrid.Main.Application.LXAPPUserInfoV2");

    LXGrid.Main.Application.LXAPPExternalInfo = Slice.defineObject(
        function(ios_bundle, andr_package, web_callback, win_registery)
        {
            Ice.Object.call(this);
            this.ios_bundle = ios_bundle !== undefined ? ios_bundle : "";
            this.andr_package = andr_package !== undefined ? andr_package : "";
            this.web_callback = web_callback !== undefined ? web_callback : "";
            this.win_registery = win_registery !== undefined ? win_registery : "";
        },
        Ice.Object, undefined, 1,
        [
            "::Ice::Object",
            "::LXGrid::Main::Application::LXAPPExternalInfo"
        ],
        -1,
        function(__os)
        {
            __os.writeString(this.ios_bundle);
            __os.writeString(this.andr_package);
            __os.writeString(this.web_callback);
            __os.writeString(this.win_registery);
        },
        function(__is)
        {
            this.ios_bundle = __is.readString();
            this.andr_package = __is.readString();
            this.web_callback = __is.readString();
            this.win_registery = __is.readString();
        },
        false);

    LXGrid.Main.Application.LXAPPExternalInfoPrx = Slice.defineProxy(Ice.ObjectPrx, LXGrid.Main.Application.LXAPPExternalInfo.ice_staticId, undefined);

    Slice.defineOperations(LXGrid.Main.Application.LXAPPExternalInfo, LXGrid.Main.Application.LXAPPExternalInfoPrx);
    Slice.defineSequence(LXGrid.Main.Application, "LXAPPExternalInfoSeqHelper", "Ice.ObjectHelper", false, "LXGrid.Main.Application.LXAPPExternalInfo");

    LXGrid.Main.Application.LXAPPSecurityInfo = Slice.defineObject(
        function(provider_id, private_key, provider_tag)
        {
            Ice.Object.call(this);
            this.provider_id = provider_id !== undefined ? provider_id : 0;
            this.private_key = private_key !== undefined ? private_key : "";
            this.provider_tag = provider_tag !== undefined ? provider_tag : "";
        },
        Ice.Object, undefined, 1,
        [
            "::Ice::Object",
            "::LXGrid::Main::Application::LXAPPSecurityInfo"
        ],
        -1,
        function(__os)
        {
            __os.writeInt(this.provider_id);
            __os.writeString(this.private_key);
            __os.writeString(this.provider_tag);
        },
        function(__is)
        {
            this.provider_id = __is.readInt();
            this.private_key = __is.readString();
            this.provider_tag = __is.readString();
        },
        false);

    LXGrid.Main.Application.LXAPPSecurityInfoPrx = Slice.defineProxy(Ice.ObjectPrx, LXGrid.Main.Application.LXAPPSecurityInfo.ice_staticId, undefined);

    Slice.defineOperations(LXGrid.Main.Application.LXAPPSecurityInfo, LXGrid.Main.Application.LXAPPSecurityInfoPrx);
    Slice.defineSequence(LXGrid.Main.Application, "LXAPPSecurityInfoSeqHelper", "Ice.ObjectHelper", false, "LXGrid.Main.Application.LXAPPSecurityInfo");

    LXGrid.Main.Application.LXAPPPaymentInfo = Slice.defineObject(
        function(provider_id, private_key)
        {
            Ice.Object.call(this);
            this.provider_id = provider_id !== undefined ? provider_id : 0;
            this.private_key = private_key !== undefined ? private_key : "";
        },
        Ice.Object, undefined, 1,
        [
            "::Ice::Object",
            "::LXGrid::Main::Application::LXAPPPaymentInfo"
        ],
        -1,
        function(__os)
        {
            __os.writeInt(this.provider_id);
            __os.writeString(this.private_key);
        },
        function(__is)
        {
            this.provider_id = __is.readInt();
            this.private_key = __is.readString();
        },
        false);

    LXGrid.Main.Application.LXAPPPaymentInfoPrx = Slice.defineProxy(Ice.ObjectPrx, LXGrid.Main.Application.LXAPPPaymentInfo.ice_staticId, undefined);

    Slice.defineOperations(LXGrid.Main.Application.LXAPPPaymentInfo, LXGrid.Main.Application.LXAPPPaymentInfoPrx);
    Slice.defineSequence(LXGrid.Main.Application, "LXAPPPaymentInfoSeqHelper", "Ice.ObjectHelper", false, "LXGrid.Main.Application.LXAPPPaymentInfo");

    LXGrid.Main.Application.LXAPPUserType = Slice.defineObject(
        function(type_id, type_name, app_ids)
        {
            Ice.Object.call(this);
            this.type_id = type_id !== undefined ? type_id : 0;
            this.type_name = type_name !== undefined ? type_name : "";
            this.app_ids = app_ids !== undefined ? app_ids : null;
        },
        Ice.Object, undefined, 1,
        [
            "::Ice::Object",
            "::LXGrid::Main::Application::LXAPPUserType"
        ],
        -1,
        function(__os)
        {
            __os.writeInt(this.type_id);
            __os.writeString(this.type_name);
            Ice.IntSeqHelper.write(__os, this.app_ids);
        },
        function(__is)
        {
            this.type_id = __is.readInt();
            this.type_name = __is.readString();
            this.app_ids = Ice.IntSeqHelper.read(__is);
        },
        false);

    LXGrid.Main.Application.LXAPPUserTypePrx = Slice.defineProxy(Ice.ObjectPrx, LXGrid.Main.Application.LXAPPUserType.ice_staticId, undefined);

    Slice.defineOperations(LXGrid.Main.Application.LXAPPUserType, LXGrid.Main.Application.LXAPPUserTypePrx);
    Slice.defineSequence(LXGrid.Main.Application, "LXAPPUserTypeSeqHelper", "Ice.ObjectHelper", false, "LXGrid.Main.Application.LXAPPUserType");

    LXGrid.Main.Application.LXAPPUserRecom = Slice.defineObject(
        function(rec_id, lock_num, rec_name, app_ids)
        {
            Ice.Object.call(this);
            this.rec_id = rec_id !== undefined ? rec_id : 0;
            this.lock_num = lock_num !== undefined ? lock_num : 0;
            this.rec_name = rec_name !== undefined ? rec_name : "";
            this.app_ids = app_ids !== undefined ? app_ids : null;
        },
        Ice.Object, undefined, 1,
        [
            "::Ice::Object",
            "::LXGrid::Main::Application::LXAPPUserRecom"
        ],
        -1,
        function(__os)
        {
            __os.writeInt(this.rec_id);
            __os.writeInt(this.lock_num);
            __os.writeString(this.rec_name);
            Ice.IntSeqHelper.write(__os, this.app_ids);
        },
        function(__is)
        {
            this.rec_id = __is.readInt();
            this.lock_num = __is.readInt();
            this.rec_name = __is.readString();
            this.app_ids = Ice.IntSeqHelper.read(__is);
        },
        false);

    LXGrid.Main.Application.LXAPPUserRecomPrx = Slice.defineProxy(Ice.ObjectPrx, LXGrid.Main.Application.LXAPPUserRecom.ice_staticId, undefined);

    Slice.defineOperations(LXGrid.Main.Application.LXAPPUserRecom, LXGrid.Main.Application.LXAPPUserRecomPrx);
    Slice.defineSequence(LXGrid.Main.Application, "LXAPPUserRecomSeqHelper", "Ice.ObjectHelper", false, "LXGrid.Main.Application.LXAPPUserRecom");

    LXGrid.Main.Application.LXAPPTypeInfo = Slice.defineObject(
        function(type_id, type_name, sort_num, type_apps, in_time)
        {
            Ice.Object.call(this);
            this.type_id = type_id !== undefined ? type_id : 0;
            this.type_name = type_name !== undefined ? type_name : "";
            this.sort_num = sort_num !== undefined ? sort_num : 0;
            this.type_apps = type_apps !== undefined ? type_apps : null;
            this.in_time = in_time !== undefined ? in_time : 0;
        },
        Ice.Object, undefined, 1,
        [
            "::Ice::Object",
            "::LXGrid::Main::Application::LXAPPTypeInfo"
        ],
        -1,
        function(__os)
        {
            __os.writeInt(this.type_id);
            __os.writeString(this.type_name);
            __os.writeInt(this.sort_num);
            Ice.IntSeqHelper.write(__os, this.type_apps);
            __os.writeLong(this.in_time);
        },
        function(__is)
        {
            this.type_id = __is.readInt();
            this.type_name = __is.readString();
            this.sort_num = __is.readInt();
            this.type_apps = Ice.IntSeqHelper.read(__is);
            this.in_time = __is.readLong();
        },
        false);

    LXGrid.Main.Application.LXAPPTypeInfoPrx = Slice.defineProxy(Ice.ObjectPrx, LXGrid.Main.Application.LXAPPTypeInfo.ice_staticId, undefined);

    Slice.defineOperations(LXGrid.Main.Application.LXAPPTypeInfo, LXGrid.Main.Application.LXAPPTypeInfoPrx);
    Slice.defineSequence(LXGrid.Main.Application, "LXAPPTypeInfoSeqHelper", "Ice.ObjectHelper", false, "LXGrid.Main.Application.LXAPPTypeInfo");

    LXGrid.Main.Application.LXAPPRecomInfo = Slice.defineObject(
        function(rec_id, rec_name, lock_num, rec_rules, type_apps, in_time)
        {
            Ice.Object.call(this);
            this.rec_id = rec_id !== undefined ? rec_id : 0;
            this.rec_name = rec_name !== undefined ? rec_name : "";
            this.lock_num = lock_num !== undefined ? lock_num : 0;
            this.rec_rules = rec_rules !== undefined ? rec_rules : "";
            this.type_apps = type_apps !== undefined ? type_apps : null;
            this.in_time = in_time !== undefined ? in_time : 0;
        },
        Ice.Object, undefined, 1,
        [
            "::Ice::Object",
            "::LXGrid::Main::Application::LXAPPRecomInfo"
        ],
        -1,
        function(__os)
        {
            __os.writeInt(this.rec_id);
            __os.writeString(this.rec_name);
            __os.writeInt(this.lock_num);
            __os.writeString(this.rec_rules);
            Ice.IntSeqHelper.write(__os, this.type_apps);
            __os.writeLong(this.in_time);
        },
        function(__is)
        {
            this.rec_id = __is.readInt();
            this.rec_name = __is.readString();
            this.lock_num = __is.readInt();
            this.rec_rules = __is.readString();
            this.type_apps = Ice.IntSeqHelper.read(__is);
            this.in_time = __is.readLong();
        },
        false);

    LXGrid.Main.Application.LXAPPRecomInfoPrx = Slice.defineProxy(Ice.ObjectPrx, LXGrid.Main.Application.LXAPPRecomInfo.ice_staticId, undefined);

    Slice.defineOperations(LXGrid.Main.Application.LXAPPRecomInfo, LXGrid.Main.Application.LXAPPRecomInfoPrx);
    Slice.defineSequence(LXGrid.Main.Application, "LXAPPRecomInfoSeqHelper", "Ice.ObjectHelper", false, "LXGrid.Main.Application.LXAPPRecomInfo");
    exports.LXGrid = LXGrid;
}
(typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? module : undefined,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? require : window.Ice.__require,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? exports : window));
