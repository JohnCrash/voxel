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
// Generated from file `LXSliceStatisticsAnalysis.ice'
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
        "LXGrid.OM/Statistics/LXSliceStatisticsDefine"
    ]).LXGrid;
    
    var Slice = Ice.Slice;

    LXGrid.Statistics = __M.module("LXGrid.Statistics");

    LXGrid.Statistics.Analysis = __M.module("LXGrid.Statistics.Analysis");

    Object.defineProperty(LXGrid.Statistics.Analysis, 'IObjectStatisticsAnalysisName', {
        value: "IObjectStatisticsAnalysis"
    });

    LXGrid.Statistics.Analysis.IObjectStatisticsAnalysis = Slice.defineObject(
        undefined,
        Ice.Object,
        [
            LXGrid.Common.IObjectMasterSlaveBase
        ], 3,
        [
            "::Ice::Object",
            "::LXGrid::Common::IObjectBase",
            "::LXGrid::Common::IObjectMasterSlaveBase",
            "::LXGrid::Statistics::Analysis::IObjectStatisticsAnalysis"
        ],
        -1, undefined, undefined, false);

    LXGrid.Statistics.Analysis.IObjectStatisticsAnalysisPrx = Slice.defineProxy(Ice.ObjectPrx, LXGrid.Statistics.Analysis.IObjectStatisticsAnalysis.ice_staticId, [
        LXGrid.Common.IObjectMasterSlaveBasePrx]);

    Slice.defineOperations(LXGrid.Statistics.Analysis.IObjectStatisticsAnalysis, LXGrid.Statistics.Analysis.IObjectStatisticsAnalysisPrx,
    {
        "OnUserOnline": [, , , 1, , , [[3], [3], [1]], , , , ]
    });
    exports.LXGrid = LXGrid;
}
(typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? module : undefined,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? require : window.Ice.__require,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? exports : window));
