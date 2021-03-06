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
// Generated from file `LXSliceDealerDefine.ice'
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
        "LXGrid.OM/LXSliceGridDefine"
    ]).LXGrid;
    
    var Slice = Ice.Slice;

    LXGrid.Dealer = __M.module("LXGrid.Dealer");

    Object.defineProperty(LXGrid.Dealer, 'LXConstCountTotal', {
        value: -1
    });

    LXGrid.Dealer.SJEnumErrorDealer = Slice.defineEnum([
        ['SJErrorUserNotExist', 1000], ['SJErrorAlreadyActive', 1001], ['SJErrorInvalidPassword', 1002], ['SJErrorUnkownDevice', 1003], ['SJErrorNotActive', 1004],
        ['SJErrorInvalidAuthCode', 1005], ['SJErrorOftenAuthCode', 1006], ['SJErrorNotLogin', 1007], ['SJErrorInvalidUserToken', 1008], ['SJErrorInvalidAccessToken', 1009],
        ['SJErrorInvalidAppID', 1010], ['SJErrorNoPower', 1011], ['SJErrorAppNotLogin', 1012]]);

    LXGrid.Dealer.SJEnumAccountStatus = Slice.defineEnum([
        ['SJAccountStatus_Inactive', 0], ['SJAccountStatus_Avtive', 1], ['SJAccountStatus_Disable', 2], ['SJAccountStatus_Delete', 4]]);

    LXGrid.Dealer.SJEnumDeviceType = Slice.defineEnum([
        ['SJDeviceType_Unknown', 0], ['SJDeviceType_Web', 1], ['SJDeviceType_AndroidPhone', 2], ['SJDeviceType_Pad', 4], ['SJDeviceType_IPhone', 8],
        ['SJDeviceType_IPad', 16], ['SJDeviceType_PC', 32]]);

    LXGrid.Dealer.SJEnumGender = Slice.defineEnum([
        ['SJGender_Unknown', 0], ['SJGender_female', 1], ['SJGender_male', 2]]);

    LXGrid.Dealer.SJEnumStaffType = Slice.defineEnum([
        ['SJStaffType_Unknown', 0], ['SJStaffType_Outsource', 1], ['SJStaffType_Cooperation', 2], ['SJStaffType_Temporary', 4], ['SJStaffType_Official', 8]]);

    LXGrid.Dealer.SJEnumStaffStatus = Slice.defineEnum([
        ['SJStaffStatus_Unknown', 0], ['SJStaffStatus_Probation', 1], ['SJStaffStatus_Leave', 10], ['SJStaffStatus_Suspend', 11], ['SJStaffStatus_Dismiss', 12],
        ['SJStaffStatus_Normal', 200]]);

    LXGrid.Dealer.SJEnumMaritalStatus = Slice.defineEnum([
        ['SJMaritalStatus_Unknown', 0], ['SJMaritalStatus_Married', 1], ['SJMaritalStatus_Unmarried', 2]]);

    LXGrid.Dealer.SJEnumParousStatus = Slice.defineEnum([
        ['SJParousStatus_Unknown', 0], ['SJParousStatus_Nulliparous', 1], ['SJParousStatus_Parous', 2]]);

    LXGrid.Dealer.SJEnumDegreeType = Slice.defineEnum([
        ['SJDegreeType_Unknown', 0], ['SJDegreeType_Primary', 1], ['SJDegreeType_Junior', 2], ['SJDegreeType_High', 3], ['SJDegreeType_Vocational', 4],
        ['SJDegreeType_Associate', 5], ['SJDegreeType_Bachelor', 6], ['SJDegreeType_Master', 7], ['SJDegreeType_Doctorate', 8], ['SJDegreeType_Postdoctoral', 9]]);

    LXGrid.Dealer.SJEnumForeignDegreeType = Slice.defineEnum([
        ['SJForeignDegreeType_Unknown', 0]]);

    LXGrid.Dealer.SJEnumNationType = Slice.defineEnum([
        ['SJNationType_Unknown', 0], ['SJNationType_Han', 1]]);

    LXGrid.Dealer.SJEnumPoliticalStatus = Slice.defineEnum([
        ['SJPoliticalStatus_Unknown', 0], ['SJPoliticalStatus_Mass', 1], ['SJPoliticalStatus_Communist', 2], ['SJPoliticalStatus_Democratic', 3]]);

    LXGrid.Dealer.SJEnumUserInfoType = Slice.defineEnum([
        ['SJUserInfoType_Realname', 0], ['SJUserInfoType_Gender', 1], ['SJUserInfoType_Staffstatus', 2], ['SJUserInfoType_Phone', 3], ['SJUserInfoType_Marital', 4],
        ['SJUserInfoType_Parous', 5], ['SJUserInfoType_Degree', 6], ['SJUserInfoType_Foreigndegree', 7], ['SJUserInfoType_Nation', 8], ['SJUserInfoType_Areacode', 9],
        ['SJUserInfoType_Birthplace', 10], ['SJUserInfoType_Political', 11], ['SJUserInfoType_Faceimage', 12], ['SJUserInfoType_Stafftype', 13]]);

    LXGrid.Dealer.SJActionInfo = Slice.defineObject(
        function(opuid, action, args, devicetype, deviceid, ipaddress, acttime)
        {
            Ice.Object.call(this);
            this.opuid = opuid !== undefined ? opuid : 0;
            this.action = action !== undefined ? action : "";
            this.args = args !== undefined ? args : "";
            this.devicetype = devicetype !== undefined ? devicetype : 0;
            this.deviceid = deviceid !== undefined ? deviceid : "";
            this.ipaddress = ipaddress !== undefined ? ipaddress : "";
            this.acttime = acttime !== undefined ? acttime : 0;
        },
        Ice.Object, undefined, 1,
        [
            "::Ice::Object",
            "::LXGrid::Dealer::SJActionInfo"
        ],
        -1,
        function(__os)
        {
            __os.writeInt(this.opuid);
            __os.writeString(this.action);
            __os.writeString(this.args);
            __os.writeInt(this.devicetype);
            __os.writeString(this.deviceid);
            __os.writeString(this.ipaddress);
            __os.writeLong(this.acttime);
        },
        function(__is)
        {
            this.opuid = __is.readInt();
            this.action = __is.readString();
            this.args = __is.readString();
            this.devicetype = __is.readInt();
            this.deviceid = __is.readString();
            this.ipaddress = __is.readString();
            this.acttime = __is.readLong();
        },
        false);

    LXGrid.Dealer.SJActionInfoPrx = Slice.defineProxy(Ice.ObjectPrx, LXGrid.Dealer.SJActionInfo.ice_staticId, undefined);

    Slice.defineOperations(LXGrid.Dealer.SJActionInfo, LXGrid.Dealer.SJActionInfoPrx);
    Slice.defineSequence(LXGrid.Dealer, "SJActionInfoSeqHelper", "Ice.ObjectHelper", false, "LXGrid.Dealer.SJActionInfo");

    LXGrid.Dealer.SJOnlineApp = Slice.defineObject(
        function(logintime, appid)
        {
            Ice.Object.call(this);
            this.logintime = logintime !== undefined ? logintime : 0;
            this.appid = appid !== undefined ? appid : 0;
        },
        Ice.Object, undefined, 1,
        [
            "::Ice::Object",
            "::LXGrid::Dealer::SJOnlineApp"
        ],
        -1,
        function(__os)
        {
            __os.writeLong(this.logintime);
            __os.writeInt(this.appid);
        },
        function(__is)
        {
            this.logintime = __is.readLong();
            this.appid = __is.readInt();
        },
        false);

    LXGrid.Dealer.SJOnlineAppPrx = Slice.defineProxy(Ice.ObjectPrx, LXGrid.Dealer.SJOnlineApp.ice_staticId, undefined);

    Slice.defineOperations(LXGrid.Dealer.SJOnlineApp, LXGrid.Dealer.SJOnlineAppPrx);
    Slice.defineSequence(LXGrid.Dealer, "SJOnlineAppSeqHelper", "Ice.ObjectHelper", false, "LXGrid.Dealer.SJOnlineApp");
    Slice.defineDictionary(LXGrid.Dealer, "SJOnlineDeviceAppDict", "SJOnlineDeviceAppDictHelper", "Ice.StringHelper", "LXGrid.Dealer.SJOnlineAppSeqHelper", false, undefined, undefined, Ice.ArrayUtil.equals);

    LXGrid.Dealer.SJOnlineDevice = Slice.defineObject(
        function(logintime, devicetype, deviceid, ipaddress)
        {
            Ice.Object.call(this);
            this.logintime = logintime !== undefined ? logintime : 0;
            this.devicetype = devicetype !== undefined ? devicetype : LXGrid.Dealer.SJEnumDeviceType.SJDeviceType_Unknown;
            this.deviceid = deviceid !== undefined ? deviceid : "";
            this.ipaddress = ipaddress !== undefined ? ipaddress : "";
        },
        Ice.Object, undefined, 1,
        [
            "::Ice::Object",
            "::LXGrid::Dealer::SJOnlineDevice"
        ],
        -1,
        function(__os)
        {
            __os.writeLong(this.logintime);
            LXGrid.Dealer.SJEnumDeviceType.__write(__os, this.devicetype);
            __os.writeString(this.deviceid);
            __os.writeString(this.ipaddress);
        },
        function(__is)
        {
            this.logintime = __is.readLong();
            this.devicetype = LXGrid.Dealer.SJEnumDeviceType.__read(__is);
            this.deviceid = __is.readString();
            this.ipaddress = __is.readString();
        },
        false);

    LXGrid.Dealer.SJOnlineDevicePrx = Slice.defineProxy(Ice.ObjectPrx, LXGrid.Dealer.SJOnlineDevice.ice_staticId, undefined);

    Slice.defineOperations(LXGrid.Dealer.SJOnlineDevice, LXGrid.Dealer.SJOnlineDevicePrx);
    Slice.defineSequence(LXGrid.Dealer, "SJOnlineDeviceSeqHelper", "Ice.ObjectHelper", false, "LXGrid.Dealer.SJOnlineDevice");
    Slice.defineDictionary(LXGrid.Dealer, "SJOnlineUserDeviceSeqDict", "SJOnlineUserDeviceSeqDictHelper", "Ice.IntHelper", "LXGrid.Dealer.SJOnlineDeviceSeqHelper", false, undefined, undefined, Ice.ArrayUtil.equals);

    LXGrid.Dealer.SJOnlineStatus = Slice.defineObject(
        function(userid, devices, apps)
        {
            Ice.Object.call(this);
            this.userid = userid !== undefined ? userid : 0;
            this.devices = devices !== undefined ? devices : null;
            this.apps = apps !== undefined ? apps : null;
        },
        Ice.Object, undefined, 1,
        [
            "::Ice::Object",
            "::LXGrid::Dealer::SJOnlineStatus"
        ],
        -1,
        function(__os)
        {
            __os.writeInt(this.userid);
            LXGrid.Dealer.SJOnlineDeviceSeqHelper.write(__os, this.devices);
            LXGrid.Dealer.SJOnlineDeviceAppDictHelper.write(__os, this.apps);
        },
        function(__is)
        {
            this.userid = __is.readInt();
            this.devices = LXGrid.Dealer.SJOnlineDeviceSeqHelper.read(__is);
            this.apps = LXGrid.Dealer.SJOnlineDeviceAppDictHelper.read(__is);
        },
        false);

    LXGrid.Dealer.SJOnlineStatusPrx = Slice.defineProxy(Ice.ObjectPrx, LXGrid.Dealer.SJOnlineStatus.ice_staticId, undefined);

    Slice.defineOperations(LXGrid.Dealer.SJOnlineStatus, LXGrid.Dealer.SJOnlineStatusPrx);

    LXGrid.Dealer.SJUserInfo = Slice.defineObject(
        function(userid, loginname, realname, faceimage, gender, stafftype, staffstatus, phone, marital, parous, degree, foreigndegree, nation, areacode, birthplace, political, intime, lasttime, status)
        {
            Ice.Object.call(this);
            this.userid = userid !== undefined ? userid : 0;
            this.loginname = loginname !== undefined ? loginname : "";
            this.realname = realname !== undefined ? realname : "";
            this.faceimage = faceimage !== undefined ? faceimage : "";
            this.gender = gender !== undefined ? gender : LXGrid.Dealer.SJEnumGender.SJGender_Unknown;
            this.stafftype = stafftype !== undefined ? stafftype : 0;
            this.staffstatus = staffstatus !== undefined ? staffstatus : 0;
            this.phone = phone !== undefined ? phone : "";
            this.marital = marital !== undefined ? marital : 0;
            this.parous = parous !== undefined ? parous : 0;
            this.degree = degree !== undefined ? degree : 0;
            this.foreigndegree = foreigndegree !== undefined ? foreigndegree : 0;
            this.nation = nation !== undefined ? nation : 0;
            this.areacode = areacode !== undefined ? areacode : 0;
            this.birthplace = birthplace !== undefined ? birthplace : 0;
            this.political = political !== undefined ? political : 0;
            this.intime = intime !== undefined ? intime : 0;
            this.lasttime = lasttime !== undefined ? lasttime : 0;
            this.status = status !== undefined ? status : LXGrid.Dealer.SJEnumAccountStatus.SJAccountStatus_Inactive;
        },
        Ice.Object, undefined, 1,
        [
            "::Ice::Object",
            "::LXGrid::Dealer::SJUserInfo"
        ],
        -1,
        function(__os)
        {
            __os.writeInt(this.userid);
            __os.writeString(this.loginname);
            __os.writeString(this.realname);
            __os.writeString(this.faceimage);
            LXGrid.Dealer.SJEnumGender.__write(__os, this.gender);
            __os.writeInt(this.stafftype);
            __os.writeInt(this.staffstatus);
            __os.writeString(this.phone);
            __os.writeInt(this.marital);
            __os.writeInt(this.parous);
            __os.writeInt(this.degree);
            __os.writeInt(this.foreigndegree);
            __os.writeInt(this.nation);
            __os.writeInt(this.areacode);
            __os.writeInt(this.birthplace);
            __os.writeInt(this.political);
            __os.writeLong(this.intime);
            __os.writeLong(this.lasttime);
            LXGrid.Dealer.SJEnumAccountStatus.__write(__os, this.status);
        },
        function(__is)
        {
            this.userid = __is.readInt();
            this.loginname = __is.readString();
            this.realname = __is.readString();
            this.faceimage = __is.readString();
            this.gender = LXGrid.Dealer.SJEnumGender.__read(__is);
            this.stafftype = __is.readInt();
            this.staffstatus = __is.readInt();
            this.phone = __is.readString();
            this.marital = __is.readInt();
            this.parous = __is.readInt();
            this.degree = __is.readInt();
            this.foreigndegree = __is.readInt();
            this.nation = __is.readInt();
            this.areacode = __is.readInt();
            this.birthplace = __is.readInt();
            this.political = __is.readInt();
            this.intime = __is.readLong();
            this.lasttime = __is.readLong();
            this.status = LXGrid.Dealer.SJEnumAccountStatus.__read(__is);
        },
        false);

    LXGrid.Dealer.SJUserInfoPrx = Slice.defineProxy(Ice.ObjectPrx, LXGrid.Dealer.SJUserInfo.ice_staticId, undefined);

    Slice.defineOperations(LXGrid.Dealer.SJUserInfo, LXGrid.Dealer.SJUserInfoPrx);
    Slice.defineSequence(LXGrid.Dealer, "SJUserInfoSeqHelper", "Ice.ObjectHelper", false, "LXGrid.Dealer.SJUserInfo");
    exports.LXGrid = LXGrid;
}
(typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? module : undefined,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? require : window.Ice.__require,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? exports : window));
