// LXInvokerBase
(function(module, require, exports) {
    const Ice = require('ice').Ice;
    LXGrid = Ice.__M.require(module, [
        'LXGrid.Main/LXSliceGridMainDefine',
        'LXGrid.Main/Asset/LXSliceAssetDefine',
        'LXGrid.Main/Asset/LXSliceAsset',
        '../LXGridBase/LXInvokerBase',
        '../LXGridBase/LXReturnHelper',
        '../LXGridBase/LXUtil'
    ]).LXGrid;

    class LXSliceInvokerAsset extends LXGrid.LXInvokerBase {
        constructor(filename) {
            super(filename,
                LXGrid.Main.ThisGridName,
                LXGrid.Main.ClusterNameAsset,
                LXGrid.Main.Asset.IObjectAssetName);
        }

        // 取资产摘要，LXEnumCurrecy为货币类型
        GetAssetSummary(userId,currecy) {
            return this.Invoke(userId, (prxBase) => {
            let proxy = LXGrid.Main.Asset.IObjectAssetPrx.uncheckedCast(prxBase);
                return proxy.GetAssetSummary(userId,currecy);
            });
        }

        // 取资产明细
        GetAssetDetails(parameters,userId,beginTime,endTime, status, page, size) {
            return this.Invoke(userId, (prxBase) => {
            let proxy = LXGrid.Main.Asset.IObjectAssetPrx.uncheckedCast(prxBase);
                return proxy.GetAssetDetails(parameters,userId,beginTime,endTime, status, page, size);
            });
        }

        /**
        *  资产变更
        *      
        *  @参数 userId:账户
        *  @参数 amount:变更数量
        *  @参数 LXEnumAssetChangeState: 收入/支出
        *  @参数 remark:  变更备注
        *  @参数 atom:  上下文ID/原子性ID
        *  ...........略
        */
        AssetChange(parameters,userId,amount, status, remark,atom) {
            return this.Invoke(userId, (prxBase) => {
            let proxy = LXGrid.Main.Asset.IObjectAssetPrx.uncheckedCast(prxBase);
                return proxy.AssetChange(parameters,userId,amount, status, remark,atom);
            });
        }

        /**
        *  资产转移/用于两个账户相互转账
        *      
        *  @参数 srcUseId: 源账户     
        *  @参数 tarUserId: 目标账户    
        *  @参数 amount:变更数量
        *  @参数 srcRemark: (-)备注
        *  @参数 tarRemark: (+)备注
        *  @参数 msg:返回标示
        */
        AssetTransfer(parameters,srcUseId, tarUserId,amount, srcRemark, tarRemark ,atom) {
            return this.Invoke(srcUseId, (prxBase) => {
            let proxy = LXGrid.Main.Asset.IObjectAssetPrx.uncheckedCast(prxBase);
                return proxy.AssetTransfer(parameters,srcUseId, tarUserId,amount, srcRemark, tarRemark ,atom);
            });
        }

        /**
        *  资产冻结
        *     
        *  @参数 userId:账户
        *  @参数 amount:变更数量
        *  @参数 remark:  变更备注
        *  @参数 atom:  上下文ID/原子性ID
        *  ...........略
        */
        AssetFreeze(parameters,userId,amount, remark,atom) {
            return this.Invoke(userId, (prxBase) => {
            let proxy = LXGrid.Main.Asset.IObjectAssetPrx.uncheckedCast(prxBase);
                return proxy.AssetFreeze(parameters,userId,amount, remark,atom);
            });
        }

        /**
        *  资产解冻
        *       
        *  @参数 userId:账户
        *  @参数 amount:变更数量
        *  @参数 remark:  变更备注
        *  @参数 atom:  上下文ID/原子性ID
        *  ...........略
        */
        AssetThaw(parameters,userId,amount, remark, atom) {
            return this.Invoke(userId, (prxBase) => {
            let proxy = LXGrid.Main.Asset.IObjectAssetPrx.uncheckedCast(prxBase);
                return proxy.AssetThaw(parameters,userId,amount, remark, atom);
            });
        }

        /**
        *  刷新资产摘要
        *       
        *  @参数 userId:账户
        *  @参数 amount:变更数量
        *  @参数 currecy:收入/支出
        */
        RefreshAssetSummaryCache(userId,amount,currecy, status) {
            return this.Invoke(userId, (prxBase) => {
            let proxy = LXGrid.Main.Asset.IObjectAssetPrx.uncheckedCast(prxBase);
                return proxy.RefreshAssetSummaryCache(userId,amount,currecy, status);
            });
        }

        RemoveAssetSummaryCache(userId,currecy) {
            return this.Invoke(userId, (prxBase) => {
            let proxy = LXGrid.Main.Asset.IObjectAssetPrx.uncheckedCast(prxBase);
                return proxy.RemoveAssetSummaryCache(userId,currecy);
            });
        }
    };

    LXGrid.LXSliceInvokerAsset = LXSliceInvokerAsset;
    exports.LXGrid = LXGrid;
}
(typeof(global) !== 'undefined' && typeof(global.process) !== 'undefined' ? module : undefined,
    typeof(global) !== 'undefined' && typeof(global.process) !== 'undefined' ? require : window.Ice.__require,
    typeof(global) !== 'undefined' && typeof(global.process) !== 'undefined' ? exports : window));