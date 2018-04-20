// LXInvokerBase
(function(module, require, exports) {
        const Ice = require('ice').Ice;
        const LXGrid = Ice.__M.require(module, [
            'LXGrid.System/LXSliceCluster',
            './LXCommunicator',
            './LXReturnHelper'
        ]).LXGrid;

        const LXCommunicator = LXGrid.LXCommunicator;
        const LXReturnHelper = LXGrid.LXReturnHelper;

        class LXInvokerBase {
            constructor(filename, gridname, clustername, objname, communicator) {
                this.communicator = (communicator) ? communicator : LXCommunicator.GetInstance(filename, gridname);
                this.objectname = objname;
                this.clustername = clustername;
                this.gridname = gridname;
                this.LXPaxosOptiFactor = 1000;
            }

            // Master-Slave模式，固定resKey
            InvokeMaster(callback) {
                // 避免访问有状态对象异常
                return this.Invoke(0);
            }

            // 一致性集群调用此方法
            Invoke(reskey, callback) {
                if (!this.communicator) {
                    return new Ice.Promise().fail(LXReturnHelper.LXInvokerError('Invoke: communicator is null'));
                }

                let key;
                if (typeof reskey == 'string') {
                    key = this.GetHashCode(reskey);
                } else if (typeof reskey == 'number') {
                    key = reskey;
                } else {
                    return new Ice.Promise().fail(LXReturnHelper.LXInvokerError('Invoke: Invalid Invoker reskey'));
                }

                return this.InvokeWithRetry(Math.floor(key / this.LXPaxosOptiFactor).toString(), false, callback);
            }

            InvokeWithRetry(reskey, bRetry, callback, nodeinstance) {
                if (!this.objectname || !this.clustername || !this.gridname) {
                    return new Ice.Promise().fail(LXReturnHelper.LXInvokerError('InvokeWithRetry: empty object/cluster/grid name'));
                }

                return this.communicator.QueryProxy(reskey, this.objectname, this.clustername, this.gridname, bRetry, nodeinstance)
                    .then((r, prxBase, nodeinst) => {
                        if (!LXReturnHelper.IsLXSucceed(r)) {
                            return new Ice.Promise().fail(r);
                        }

                        if (!prxBase) {
                            return new Ice.Promise().fail(LXReturnHelper.LXInvokerError('InvokeWithRetry: Wrong proxy'));
                        }

                        // 完成重试机制
                        let ctx = new Object();
                        ctx[LXGrid.System.LXConstRequestKeyNodeInstance] = nodeinst;
                        return callback(prxBase.ice_context(ctx))
                            .exception((e) => {
                                // 如果通信异常，则重试
                                if (!bRetry) {
                                    return this.InvokeWithRetry(reskey, true, callback, nodeinst);
                                } else {
                                    return new Ice.Promise().fail(LXReturnHelper.LXInvokerError('InvokeWithRetry: InvokeWithRetry failed:' + e));
                                }
                            });
                    });
            }

            // 将字符串resKey转换为整数以优化选举
            // 伟大的Knuth在《编程的艺术 第三卷》的第六章排序和搜索中给出的DEK哈希算法
            // 字符串较短时，比Daniel J.Bernstein教授给出的DJB哈希算法性能更好
            // 长度20字符时，1千万次耗时约350ms
            GetHashCode(resKey) {
                if (resKey == '') return 0;

                // 最多处理64个字符
                let hash = resKey.length;
                let len = Math.min(64, resKey.length);

                for (let i = 0; i < len; i++) {
                    hash = ((hash << 5) ^ (hash >> 27)) ^ resKey.charCodeAt(i);
                }

                return 0x7FFFFFFF & hash;
            }
        };

        LXGrid.LXInvokerBase = LXInvokerBase;

        exports.LXGrid = LXGrid;
    }
    (typeof(global) !== 'undefined' && typeof(global.process) !== 'undefined' ? module : undefined,
        typeof(global) !== 'undefined' && typeof(global.process) !== 'undefined' ? require : window.Ice.__require,
        typeof(global) !== 'undefined' && typeof(global.process) !== 'undefined' ? exports : window));