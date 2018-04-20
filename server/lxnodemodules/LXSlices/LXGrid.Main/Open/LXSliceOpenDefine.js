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
// Generated from file `LXSliceOpenDefine.ice'
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

    LXGrid.Main = __M.module("LXGrid.Main");

    LXGrid.Main.Open = __M.module("LXGrid.Main.Open");

    LXGrid.Main.Open.LXEnumErrorOpen = Slice.defineEnum([
        ['LXBusiErrorOpenAppWrong', 12001], ['LXBusiErrorOpenUserWrong', 12002], ['LXBusiErrorTempCodeWrong', 12003], ['LXBusiErrorOpenTokenWrong', 12004], ['LXBusiErrorOpenIdWrong', 12005]]);

    LXGrid.Main.Open.LXEnumOpenAuthMode = Slice.defineEnum([
        ['LXOpenAuthMode_Browser', 0], ['LXOpenAuthMode_Client', 1], ['LXOpenAuthMode_ScanCode', 2]]);

    LXGrid.Main.Open.LXOpenAuthExtra = Slice.defineStruct(
        function(DeviceType, DeviceName, DeviceToken, IpAddr)
        {
            this.DeviceType = DeviceType !== undefined ? DeviceType : 0;
            this.DeviceName = DeviceName !== undefined ? DeviceName : "";
            this.DeviceToken = DeviceToken !== undefined ? DeviceToken : "";
            this.IpAddr = IpAddr !== undefined ? IpAddr : "";
        },
        true,
        function(__os)
        {
            __os.writeInt(this.DeviceType);
            __os.writeString(this.DeviceName);
            __os.writeString(this.DeviceToken);
            __os.writeString(this.IpAddr);
        },
        function(__is)
        {
            this.DeviceType = __is.readInt();
            this.DeviceName = __is.readString();
            this.DeviceToken = __is.readString();
            this.IpAddr = __is.readString();
        },
        7, 
        false);

    LXGrid.Main.Open.LXTempCode = Slice.defineStruct(
        function(Code, UserId, AppId, Expire)
        {
            this.Code = Code !== undefined ? Code : "";
            this.UserId = UserId !== undefined ? UserId : 0;
            this.AppId = AppId !== undefined ? AppId : 0;
            this.Expire = Expire !== undefined ? Expire : 0;
        },
        true,
        function(__os)
        {
            __os.writeString(this.Code);
            __os.writeInt(this.UserId);
            __os.writeInt(this.AppId);
            __os.writeLong(this.Expire);
        },
        function(__is)
        {
            this.Code = __is.readString();
            this.UserId = __is.readInt();
            this.AppId = __is.readInt();
            this.Expire = __is.readLong();
        },
        17, 
        false);

    LXGrid.Main.Open.LXOpenToken = Slice.defineStruct(
        function(Token, Expire)
        {
            this.Token = Token !== undefined ? Token : "";
            this.Expire = Expire !== undefined ? Expire : 0;
        },
        true,
        function(__os)
        {
            __os.writeString(this.Token);
            __os.writeLong(this.Expire);
        },
        function(__is)
        {
            this.Token = __is.readString();
            this.Expire = __is.readLong();
        },
        9, 
        false);

    LXGrid.Main.Open.LXEnumOpenTokenStatus = Slice.defineEnum([
        ['LXOpenTokenStatus_Normal', 0], ['LXOpenTokenStatus_Expired', 1], ['LXOpenTokenStatus_PassChanged', 10], ['LXOpenTokenStatus_UserDeleted', 11]]);

    LXGrid.Main.Open.LXOpenApp = Slice.defineStruct(
        function(AppId, AppKey)
        {
            this.AppId = AppId !== undefined ? AppId : 0;
            this.AppKey = AppKey !== undefined ? AppKey : "";
        },
        true,
        function(__os)
        {
            __os.writeInt(this.AppId);
            __os.writeString(this.AppKey);
        },
        function(__is)
        {
            this.AppId = __is.readInt();
            this.AppKey = __is.readString();
        },
        5, 
        false);

    LXGrid.Main.Open.LXOpenUserInfo = Slice.defineStruct(
        function(OpenId, Gender, NickName, HeadName)
        {
            this.OpenId = OpenId !== undefined ? OpenId : "";
            this.Gender = Gender !== undefined ? Gender : 0;
            this.NickName = NickName !== undefined ? NickName : "";
            this.HeadName = HeadName !== undefined ? HeadName : "";
        },
        true,
        function(__os)
        {
            __os.writeString(this.OpenId);
            __os.writeInt(this.Gender);
            __os.writeString(this.NickName);
            __os.writeString(this.HeadName);
        },
        function(__is)
        {
            this.OpenId = __is.readString();
            this.Gender = __is.readInt();
            this.NickName = __is.readString();
            this.HeadName = __is.readString();
        },
        7, 
        false);

    LXGrid.Main.Open.LXTempCodeData = Slice.defineStruct(
        function(UserId, AppId, AuthMode, AuthTime, Extra)
        {
            this.UserId = UserId !== undefined ? UserId : 0;
            this.AppId = AppId !== undefined ? AppId : 0;
            this.AuthMode = AuthMode !== undefined ? AuthMode : 0;
            this.AuthTime = AuthTime !== undefined ? AuthTime : 0;
            this.Extra = Extra !== undefined ? Extra : new LXGrid.Main.Open.LXOpenAuthExtra();
        },
        true,
        function(__os)
        {
            __os.writeInt(this.UserId);
            __os.writeInt(this.AppId);
            __os.writeInt(this.AuthMode);
            __os.writeLong(this.AuthTime);
            LXGrid.Main.Open.LXOpenAuthExtra.write(__os, this.Extra);
        },
        function(__is)
        {
            this.UserId = __is.readInt();
            this.AppId = __is.readInt();
            this.AuthMode = __is.readInt();
            this.AuthTime = __is.readLong();
            this.Extra = LXGrid.Main.Open.LXOpenAuthExtra.read(__is, this.Extra);
        },
        27, 
        false);
    exports.LXGrid = LXGrid;
}
(typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? module : undefined,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? require : window.Ice.__require,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? exports : window));
