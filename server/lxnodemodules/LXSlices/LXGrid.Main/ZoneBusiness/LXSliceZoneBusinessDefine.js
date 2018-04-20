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
// Generated from file `LXSliceZoneBusinessDefine.ice'
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
        "LXGrid.Main/Zone/LXSliceZoneEnum",
        "LXGrid.Main/Zone/LXSliceZoneDefine"
    ]).LXGrid;
    
    var Slice = Ice.Slice;

    LXGrid.Main = __M.module("LXGrid.Main");

    LXGrid.Main.ZoneBusiness = __M.module("LXGrid.Main.ZoneBusiness");

    LXGrid.Main.ZoneBusiness.LXBitSchoolMode = Slice.defineEnum([
        ['SCHMODE_NurSchool', 1], ['SCHMODE_JunSchool', 2], ['SCHMODE_MidSchool', 4], ['SCHMODE_SpeSchool', 8], ['SCHMODE_HighSchool', 16],
        ['SCHMODE_UniSchool', 32]]);

    LXGrid.Main.ZoneBusiness.LXEnumGrade = Slice.defineEnum([
        ['LXGrade_1', 1], ['LXGrade_2', 2], ['LXGrade_3', 3], ['LXGrade_4', 4], ['LXGrade_5', 5],
        ['LXGrade_6', 6], ['LXGrade_7', 7], ['LXGrade_8', 8], ['LXGrade_9', 9], ['LXGrade_10', 10],
        ['LXGrade_11', 11], ['LXGrade_12', 12], ['LXGrade_Garden_1', 101], ['LXGrade_Garden_2', 102], ['LXGrade_Garden_3', 103],
        ['LXGrade_Garden_4', 104], ['LXGrade_HighSchool_1', 201], ['LXGrade_HighSchool_202', 202], ['LXGrade_HighSchool_203', 203], ['LXGrade_HighSchool_204', 204],
        ['LXGrade_HighSchool_205', 205], ['LXGrade_HighSchool_206', 206], ['LXGrade_HighSchool_207', 207], ['LXGrade_HighSchool_208', 208], ['LXGrade_HighSchool_209', 209]]);

    LXGrid.Main.ZoneBusiness.LXSchoolInfoExt = Slice.defineStruct(
        function(zone_id, sch_mode, graduate_year, is_center, center_school_id)
        {
            this.zone_id = zone_id !== undefined ? zone_id : 0;
            this.sch_mode = sch_mode !== undefined ? sch_mode : 0;
            this.graduate_year = graduate_year !== undefined ? graduate_year : 0;
            this.is_center = is_center !== undefined ? is_center : false;
            this.center_school_id = center_school_id !== undefined ? center_school_id : 0;
        },
        true,
        function(__os)
        {
            __os.writeInt(this.zone_id);
            __os.writeInt(this.sch_mode);
            __os.writeInt(this.graduate_year);
            __os.writeBool(this.is_center);
            __os.writeInt(this.center_school_id);
        },
        function(__is)
        {
            this.zone_id = __is.readInt();
            this.sch_mode = __is.readInt();
            this.graduate_year = __is.readInt();
            this.is_center = __is.readBool();
            this.center_school_id = __is.readInt();
        },
        17, 
        true);
    Slice.defineSequence(LXGrid.Main.ZoneBusiness, "LXSchoolInfoExtSeqHelper", "LXGrid.Main.ZoneBusiness.LXSchoolInfoExt", true);

    LXGrid.Main.ZoneBusiness.LXSchoolInfo = Slice.defineObject(
        function(zone_id, zone_name, update_time, parent_zone_id, parent_mode, status, mode_form, mode_born, mode_open, mode_admit, mode_open_setting, members, comment, priority, creator_userid, creator_uname, in_time, province, city, county, sch_mode, graduate_year, is_center, center_school_id)
        {
            LXGrid.Main.Zone.LXZoneInfo.call(this, zone_id, zone_name, update_time, parent_zone_id, parent_mode, status, mode_form, mode_born, mode_open, mode_admit, mode_open_setting, members, comment, priority, creator_userid, creator_uname, in_time, province, city, county);
            this.sch_mode = sch_mode !== undefined ? sch_mode : 0;
            this.graduate_year = graduate_year !== undefined ? graduate_year : 0;
            this.is_center = is_center !== undefined ? is_center : false;
            this.center_school_id = center_school_id !== undefined ? center_school_id : 0;
        },
        LXGrid.Main.Zone.LXZoneInfo, undefined, 3,
        [
            "::Ice::Object",
            "::LXGrid::Main::Zone::LXZoneInfo",
            "::LXGrid::Main::Zone::LXZoneSimple",
            "::LXGrid::Main::ZoneBusiness::LXSchoolInfo"
        ],
        -1,
        function(__os)
        {
            __os.writeInt(this.sch_mode);
            __os.writeInt(this.graduate_year);
            __os.writeBool(this.is_center);
            __os.writeInt(this.center_school_id);
        },
        function(__is)
        {
            this.sch_mode = __is.readInt();
            this.graduate_year = __is.readInt();
            this.is_center = __is.readBool();
            this.center_school_id = __is.readInt();
        },
        false);

    LXGrid.Main.ZoneBusiness.LXSchoolInfoPrx = Slice.defineProxy(LXGrid.Main.Zone.LXZoneInfoPrx, LXGrid.Main.ZoneBusiness.LXSchoolInfo.ice_staticId, undefined);

    Slice.defineOperations(LXGrid.Main.ZoneBusiness.LXSchoolInfo, LXGrid.Main.ZoneBusiness.LXSchoolInfoPrx);
    Slice.defineSequence(LXGrid.Main.ZoneBusiness, "LXSchoolInfoSeqHelper", "Ice.ObjectHelper", false, "LXGrid.Main.ZoneBusiness.LXSchoolInfo");

    LXGrid.Main.ZoneBusiness.LXClassBorn = Slice.defineStruct(
        function(zone_id, born_year, class_num, graduate_year, sch_mode, yearnum, class_name)
        {
            this.zone_id = zone_id !== undefined ? zone_id : 0;
            this.born_year = born_year !== undefined ? born_year : 0;
            this.class_num = class_num !== undefined ? class_num : 0;
            this.graduate_year = graduate_year !== undefined ? graduate_year : 0;
            this.sch_mode = sch_mode !== undefined ? sch_mode : 0;
            this.yearnum = yearnum !== undefined ? yearnum : 0;
            this.class_name = class_name !== undefined ? class_name : "";
        },
        true,
        function(__os)
        {
            __os.writeInt(this.zone_id);
            __os.writeInt(this.born_year);
            __os.writeInt(this.class_num);
            __os.writeInt(this.graduate_year);
            __os.writeInt(this.sch_mode);
            __os.writeInt(this.yearnum);
            __os.writeString(this.class_name);
        },
        function(__is)
        {
            this.zone_id = __is.readInt();
            this.born_year = __is.readInt();
            this.class_num = __is.readInt();
            this.graduate_year = __is.readInt();
            this.sch_mode = __is.readInt();
            this.yearnum = __is.readInt();
            this.class_name = __is.readString();
        },
        25, 
        false);
    Slice.defineSequence(LXGrid.Main.ZoneBusiness, "LXClassBornSeqHelper", "LXGrid.Main.ZoneBusiness.LXClassBorn", false);

    LXGrid.Main.ZoneBusiness.LXClassInfo = Slice.defineObject(
        function(zone_id, zone_name, update_time, parent_zone_id, parent_mode, status, mode_form, mode_born, mode_open, mode_admit, mode_open_setting, members, comment, priority, creator_userid, creator_uname, in_time, province, city, county, born_year, class_num, graduate_year, sch_mode, yearnum, class_name)
        {
            LXGrid.Main.Zone.LXZoneInfo.call(this, zone_id, zone_name, update_time, parent_zone_id, parent_mode, status, mode_form, mode_born, mode_open, mode_admit, mode_open_setting, members, comment, priority, creator_userid, creator_uname, in_time, province, city, county);
            this.born_year = born_year !== undefined ? born_year : 0;
            this.class_num = class_num !== undefined ? class_num : 0;
            this.graduate_year = graduate_year !== undefined ? graduate_year : 0;
            this.sch_mode = sch_mode !== undefined ? sch_mode : 0;
            this.yearnum = yearnum !== undefined ? yearnum : 0;
            this.class_name = class_name !== undefined ? class_name : "";
        },
        LXGrid.Main.Zone.LXZoneInfo, undefined, 3,
        [
            "::Ice::Object",
            "::LXGrid::Main::Zone::LXZoneInfo",
            "::LXGrid::Main::Zone::LXZoneSimple",
            "::LXGrid::Main::ZoneBusiness::LXClassInfo"
        ],
        -1,
        function(__os)
        {
            __os.writeInt(this.born_year);
            __os.writeInt(this.class_num);
            __os.writeInt(this.graduate_year);
            __os.writeInt(this.sch_mode);
            __os.writeInt(this.yearnum);
            __os.writeString(this.class_name);
        },
        function(__is)
        {
            this.born_year = __is.readInt();
            this.class_num = __is.readInt();
            this.graduate_year = __is.readInt();
            this.sch_mode = __is.readInt();
            this.yearnum = __is.readInt();
            this.class_name = __is.readString();
        },
        false);

    LXGrid.Main.ZoneBusiness.LXClassInfoPrx = Slice.defineProxy(LXGrid.Main.Zone.LXZoneInfoPrx, LXGrid.Main.ZoneBusiness.LXClassInfo.ice_staticId, undefined);

    Slice.defineOperations(LXGrid.Main.ZoneBusiness.LXClassInfo, LXGrid.Main.ZoneBusiness.LXClassInfoPrx);
    Slice.defineSequence(LXGrid.Main.ZoneBusiness, "LXClassInfoSeqHelper", "Ice.ObjectHelper", false, "LXGrid.Main.ZoneBusiness.LXClassInfo");

    LXGrid.Main.ZoneBusiness.LXSchoolCourse = Slice.defineStruct(
        function(row_id, course, course_name, course_short_name, zone_id, user_define_name, source_type, sch_range)
        {
            this.row_id = row_id !== undefined ? row_id : 0;
            this.course = course !== undefined ? course : 0;
            this.course_name = course_name !== undefined ? course_name : "";
            this.course_short_name = course_short_name !== undefined ? course_short_name : "";
            this.zone_id = zone_id !== undefined ? zone_id : 0;
            this.user_define_name = user_define_name !== undefined ? user_define_name : "";
            this.source_type = source_type !== undefined ? source_type : 0;
            this.sch_range = sch_range !== undefined ? sch_range : 0;
        },
        true,
        function(__os)
        {
            __os.writeInt(this.row_id);
            __os.writeInt(this.course);
            __os.writeString(this.course_name);
            __os.writeString(this.course_short_name);
            __os.writeInt(this.zone_id);
            __os.writeString(this.user_define_name);
            __os.writeInt(this.source_type);
            __os.writeInt(this.sch_range);
        },
        function(__is)
        {
            this.row_id = __is.readInt();
            this.course = __is.readInt();
            this.course_name = __is.readString();
            this.course_short_name = __is.readString();
            this.zone_id = __is.readInt();
            this.user_define_name = __is.readString();
            this.source_type = __is.readInt();
            this.sch_range = __is.readInt();
        },
        23, 
        false);
    Slice.defineSequence(LXGrid.Main.ZoneBusiness, "LXSchoolCourseSeqHelper", "LXGrid.Main.ZoneBusiness.LXSchoolCourse", false);

    LXGrid.Main.ZoneBusiness.LXClassStudent = Slice.defineStruct(
        function(zone_id, user_id, stu_id, stu_number, stu_login_name, stu_login_pwd, stu_login_tag, stu_status)
        {
            this.zone_id = zone_id !== undefined ? zone_id : 0;
            this.user_id = user_id !== undefined ? user_id : 0;
            this.stu_id = stu_id !== undefined ? stu_id : 0;
            this.stu_number = stu_number !== undefined ? stu_number : "";
            this.stu_login_name = stu_login_name !== undefined ? stu_login_name : "";
            this.stu_login_pwd = stu_login_pwd !== undefined ? stu_login_pwd : "";
            this.stu_login_tag = stu_login_tag !== undefined ? stu_login_tag : 0;
            this.stu_status = stu_status !== undefined ? stu_status : 0;
        },
        true,
        function(__os)
        {
            __os.writeInt(this.zone_id);
            __os.writeInt(this.user_id);
            __os.writeInt(this.stu_id);
            __os.writeString(this.stu_number);
            __os.writeString(this.stu_login_name);
            __os.writeString(this.stu_login_pwd);
            __os.writeInt(this.stu_login_tag);
            __os.writeInt(this.stu_status);
        },
        function(__is)
        {
            this.zone_id = __is.readInt();
            this.user_id = __is.readInt();
            this.stu_id = __is.readInt();
            this.stu_number = __is.readString();
            this.stu_login_name = __is.readString();
            this.stu_login_pwd = __is.readString();
            this.stu_login_tag = __is.readInt();
            this.stu_status = __is.readInt();
        },
        23, 
        false);
    Slice.defineSequence(LXGrid.Main.ZoneBusiness, "LXClassStudentSeqHelper", "LXGrid.Main.ZoneBusiness.LXClassStudent", false);

    LXGrid.Main.ZoneBusiness.LXClassTeacher = Slice.defineStruct(
        function(zone_id, teacher_id, course, book_version)
        {
            this.zone_id = zone_id !== undefined ? zone_id : 0;
            this.teacher_id = teacher_id !== undefined ? teacher_id : 0;
            this.course = course !== undefined ? course : 0;
            this.book_version = book_version !== undefined ? book_version : 0;
        },
        true,
        function(__os)
        {
            __os.writeInt(this.zone_id);
            __os.writeInt(this.teacher_id);
            __os.writeInt(this.course);
            __os.writeInt(this.book_version);
        },
        function(__is)
        {
            this.zone_id = __is.readInt();
            this.teacher_id = __is.readInt();
            this.course = __is.readInt();
            this.book_version = __is.readInt();
        },
        16, 
        true);
    Slice.defineSequence(LXGrid.Main.ZoneBusiness, "LXClassTeacherSeqHelper", "LXGrid.Main.ZoneBusiness.LXClassTeacher", true);

    LXGrid.Main.ZoneBusiness.LXClassInfoExt = Slice.defineObject(
        function(zone_id, zone_name, update_time, parent_zone_id, parent_mode, status, mode_form, mode_born, mode_open, mode_admit, mode_open_setting, members, comment, priority, creator_userid, creator_uname, in_time, province, city, county, born_year, class_num, graduate_year, sch_mode, yearnum, class_name, master_user_id, teacher_count, student_count)
        {
            LXGrid.Main.ZoneBusiness.LXClassInfo.call(this, zone_id, zone_name, update_time, parent_zone_id, parent_mode, status, mode_form, mode_born, mode_open, mode_admit, mode_open_setting, members, comment, priority, creator_userid, creator_uname, in_time, province, city, county, born_year, class_num, graduate_year, sch_mode, yearnum, class_name);
            this.master_user_id = master_user_id !== undefined ? master_user_id : 0;
            this.teacher_count = teacher_count !== undefined ? teacher_count : 0;
            this.student_count = student_count !== undefined ? student_count : 0;
        },
        LXGrid.Main.ZoneBusiness.LXClassInfo, undefined, 4,
        [
            "::Ice::Object",
            "::LXGrid::Main::Zone::LXZoneInfo",
            "::LXGrid::Main::Zone::LXZoneSimple",
            "::LXGrid::Main::ZoneBusiness::LXClassInfo",
            "::LXGrid::Main::ZoneBusiness::LXClassInfoExt"
        ],
        -1,
        function(__os)
        {
            __os.writeInt(this.master_user_id);
            __os.writeInt(this.teacher_count);
            __os.writeInt(this.student_count);
        },
        function(__is)
        {
            this.master_user_id = __is.readInt();
            this.teacher_count = __is.readInt();
            this.student_count = __is.readInt();
        },
        false);

    LXGrid.Main.ZoneBusiness.LXClassInfoExtPrx = Slice.defineProxy(LXGrid.Main.ZoneBusiness.LXClassInfoPrx, LXGrid.Main.ZoneBusiness.LXClassInfoExt.ice_staticId, undefined);

    Slice.defineOperations(LXGrid.Main.ZoneBusiness.LXClassInfoExt, LXGrid.Main.ZoneBusiness.LXClassInfoExtPrx);
    Slice.defineSequence(LXGrid.Main.ZoneBusiness, "LXClassInfoExtSeqHelper", "Ice.ObjectHelper", false, "LXGrid.Main.ZoneBusiness.LXClassInfoExt");

    LXGrid.Main.ZoneBusiness.LXClassSummary = Slice.defineStruct(
        function(zone_id, master_user_id, teacher_count, student_count)
        {
            this.zone_id = zone_id !== undefined ? zone_id : 0;
            this.master_user_id = master_user_id !== undefined ? master_user_id : 0;
            this.teacher_count = teacher_count !== undefined ? teacher_count : 0;
            this.student_count = student_count !== undefined ? student_count : 0;
        },
        true,
        function(__os)
        {
            __os.writeInt(this.zone_id);
            __os.writeInt(this.master_user_id);
            __os.writeInt(this.teacher_count);
            __os.writeInt(this.student_count);
        },
        function(__is)
        {
            this.zone_id = __is.readInt();
            this.master_user_id = __is.readInt();
            this.teacher_count = __is.readInt();
            this.student_count = __is.readInt();
        },
        16, 
        true);
    Slice.defineSequence(LXGrid.Main.ZoneBusiness, "LXClassSummarySeqHelper", "LXGrid.Main.ZoneBusiness.LXClassSummary", true);
    exports.LXGrid = LXGrid;
}
(typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? module : undefined,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? require : window.Ice.__require,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? exports : window));
