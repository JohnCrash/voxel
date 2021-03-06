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
// Generated from file `LXSliceIDManager.ice'
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

    LXGrid.Global = __M.module("LXGrid.Global");

    LXGrid.Global.LXEnumObjectType = Slice.defineEnum([
        ['LXObjectTypePerson', 1], ['LXObjectTypeSchoolClass', 2], ['LXObjectTypeSchool', 3], ['LXObjectTypeEduResearchGroup', 4], ['LXObjectTypeEduOfficialOrg', 5],
        ['LXObjectTypeEduOrg', 6], ['LXObjectTypeParentGroup', 7], ['LXObjectTypeNormalGroup', 8], ['LXObjectTypeTeacherGroup', 9], ['LXObjectTypeTeacherMasterGroup', 10],
        ['LXObjectTypeFamily', 11], ['LXObjectTypeAreaAsset', 22]]);

    Object.defineProperty(LXGrid.Global, 'IObjectIDManagerName', {
        value: "IObjectIDManager"
    });

    LXGrid.Global.IObjectIDManager = Slice.defineObject(
        undefined,
        Ice.Object,
        [
            LXGrid.Common.IObjectBase
        ], 2,
        [
            "::Ice::Object",
            "::LXGrid::Common::IObjectBase",
            "::LXGrid::Global::IObjectIDManager"
        ],
        -1, undefined, undefined, false);

    LXGrid.Global.IObjectIDManagerPrx = Slice.defineProxy(Ice.ObjectPrx, LXGrid.Global.IObjectIDManager.ice_staticId, [
        LXGrid.Common.IObjectBasePrx]);

    Slice.defineOperations(LXGrid.Global.IObjectIDManager, LXGrid.Global.IObjectIDManagerPrx,
    {
        "CreateObjectID": [, , , 1, , [LXGrid.Common.LXReturn], [[3], [7]], [[3]], , , ],
        "GetObjectType": [, , , , , [LXGrid.Common.LXReturn], [[3]], [[3]], , , ],
        "GetObjectTypeSeq": [, , , , , [LXGrid.Common.LXReturn], [["Ice.IntSeqHelper"]], [["Ice.IntSeqHelper"]], , , ]
    });
    exports.LXGrid = LXGrid;
}
(typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? module : undefined,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? require : window.Ice.__require,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? exports : window));
