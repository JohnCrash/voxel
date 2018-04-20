// LXCommunicator
(function(module, require, exports) {
        const Ice = require('ice').Ice;
        const LXGrid = Ice.__M.require(module, [
            'LXGrid.System/LXSliceCluster',
            'LXGrid.System/LXSliceGrid',
            './LXReturnHelper'
        ]).LXGrid;

        const md5 = require('js-md5');
        const LXReturnHelper = LXGrid.LXReturnHelper;

        var communicatorCache = new Object();

        // LXCommunicator对象工厂
        // 缓存、根据GridName创建LXCommunicator对象
        // 模块导出 LXCommunicator接口
        class ILXCommunicator {
            Initialize(comm) {
                this.content = new LXCommunicator();
                return this.content.Initialize(comm);
            }

            static GetInstance(filename, gridname) {
                if (gridname in communicatorCache) {
                    return communicatorCache[gridname];
                }

                let comm = this.CreateCommunicator(filename, gridname);
                if (!comm) {
                    console.log('[error] LXCommunicator GetInstance CreateCommunicator Config is invalid')
                    return null;
                }

                communicatorCache[gridname] = comm;
                return comm;
            }

            static CreateCommunicator(filename, gridname) {
                let configfilename = filename != undefined ? filename : 'C:\\xconfig\\grid2\\lxc-' + gridname + '.txt';
                let cfg = require('querystring').parse(require('fs').readFileSync(configfilename, 'ascii'), '\r\n', '=');

                let initData = new Ice.InitializationData();
                initData.properties = Ice.createProperties();
                for (let k in cfg) {
                    initData.properties.setProperty(k, cfg[k]);
                }

                let ic = Ice.initialize(initData);
                let comm = new ILXCommunicator();
                if (!ic || !comm.Initialize(ic)) {
                    return null;
                }
                return comm;
            }

            // 代理获取
            // @reskey，一致性KEY，如果目标集群为非一致性集群，则reskey设置为NULL即可。
            // @gridName，网格名称，如果访问本网格对象，gridName可以为空。
            // @isFailRetry，在现有代理访问失败情况下，重新查询时，isFailRetry需要设置为true
            // @nodeinstanceid，节点标识，即是输入参数也是输出参数，如果isFaileRetry为ture，则需要传入对应的node，内部会进行节点数据过期处理。
            QueryProxy(reskey, objName, clusterName, gridName, isFailedRetry, nodeinstanceid) {
                return this.content.QueryProxy(reskey, objName, clusterName, gridName, isFailedRetry, nodeinstanceid);
            }

            // 取内部的ICE通讯器
            GetIceCommunicator() {
                return this.content.GetIceCommunicator();
            }

            destory() {
                this.content.destory();
            }
        };

        class LXCommunicator {
            Initialize(comm) {
                // 内部对象 Ice.Communicator
                this.communicator = comm;
                if (!this.communicator) {
                    console.log('[exception] LXCommunicator constructor parameter ice.communicator is null');
                    return false;
                }

                let prxBase = this.communicator.stringToProxy(LXGrid.System.IObjectGridName);
                this.gridPrx = LXGrid.System.IObjectGridPrx.uncheckedCast(prxBase);
                if (!this.gridPrx) {
                    console.log('[exception] Get grid proxy is null');
                    return false;
                }

                // 维护一致性节点信息, 初始化，不需要过期清理
                this.constNodes = new Object();

                // 维护集群节点对象信息
                this.clusterObjects = new Object();

                // 维护集群代理信息
                this.clusterProxies = new Object();

                // 每20秒更新一次，使得新入节点能够参与工作。
                this.timeInterval = setInterval(this.OnUpdate.bind(this), 2000)
                return true;
            }

            destory() {
                if (this.timeInterval) {
                    clearInterval(this.timeInterval);
                    this.timeInterval = null;
                }
                if (this.communicator) {
                    this.communicator.destory();
                    this.communicator = null;
                }
            }

            // 取内部的ICE通讯器
            GetIceCommunicator() {
                return this.communicator;
            }

            // 代理获取
            QueryProxy(reskey, objName, clusterName, gridName, isFailedRetry, nodeinstanceid) {
                if (!objName || !clusterName || (isFailedRetry && !nodeinstanceid)) {
                    return new Ice.Promise().fail(LXReturnHelper.LXInvokerError('QueryProxy: QueryProxy parameter is invalid'));
                }

                // 每个不同资源代理查询顺序执行，以降低服务端选举冲击。
                if (reskey) {
                    return this.QueryProxy_ClusterConst(reskey, objName, clusterName, gridName, isFailedRetry, nodeinstanceid);
                } else {
                    return this.QueryProxy_ClusterStateless(objName, clusterName, gridName, isFailedRetry, nodeinstanceid);
                }
            }

            OnUpdate() {
                for (let k in this.clusterProxies) {
                    let o = k.split(',');
                    this.UpdateClusterDeploy(o[1], o[0]);
                }
            }

            QueryProxy_ClusterConst(reskey, objName, clusterName, gridName, isFailedRetry, nodeinstanceid) {
                if (!reskey) return new Ice.Promise().fail(LXReturnHelper.LXInvokerError('QueryProxy_ClusterConst invalid reskey:' + reskey));

                let nodeKey = this.MakeConstNodeKey(reskey, gridName, clusterName, objName);

                if (isFailedRetry) {
                    delete this.constNodes[nodeKey];
                    this.ClearNodeObjects(gridName, clusterName, nodeinstanceid);
                    return this.QueryProxy_ClusterConst(reskey, objName, clusterName, gridName, false);
                }

                let cacheHited = (nodeKey in this.constNodes);
                let nodeinst = this.constNodes[nodeKey];

                if (cacheHited && nodeinst) {
                    let proxy = this.GetNodeObject(nodeinst, gridName, clusterName, objName);
                    if (proxy) {
                        return new Ice.Promise().succeed(LXReturnHelper.LXSucceed(), proxy, nodeinst);
                    }
                }

                return this.QueryConstObjectRemote(reskey, objName, clusterName, gridName);
            }

            QueryProxy_ClusterStateless(objName, clusterName, gridName, isFailedRetry, nodeinstanceid) {
                if (isFailedRetry) {
                    this.ClearNodeObjects(gridName, clusterName, nodeinstanceid);
                    return this.QueryProxy_ClusterStateless(objName, clusterName, gridName, false);
                }

                let { proxy, nodeinst } = this.GetRandomProxy(gridName, clusterName, objName);
                if (!proxy || !nodeinstanceid) {
                    return this.QueryConstObjectRemote('', objName, clusterName, gridName);
                }

                return new Ice.Promise().succeed(LXReturnHelper.LXSucceed(), proxy, nodeinst);
            }

            UpdateClusterDeploy(clusterName, gridName) {
                return this.gridPrx.QueryClusterNodes(clusterName, gridName).then((r, proxies) => {
                    if (LXReturnHelper.IsLXSucceed(r)) {
                        this.clusterProxies[this.GetClusterKey(gridName, clusterName)] = proxies;
                        return new Ice.Promise().succeed(r, proxies);
                    }
                    return new Ice.Promise().fail(LXReturnHelper.LXInvokerError('QueryClusterNodes Failed clusterName:' + clusterName + 'gridName' + gridName));
                });
            }

            GetNodeObject(nodeid, gridname, clustername, objName) {
                let key = this.GetClusterKey(gridname, clustername);

                if (key in this.clusterObjects) {
                    if (nodeid in this.clusterObjects[key]) {
                        if (objName in this.clusterObjects[key][nodeid]) {
                            return this.clusterObjects[key][nodeid][objName];
                        }
                    }
                }

                return null;
            }

            ClearNodeObjects(gridname, clustername, nodeinstanceid) {
                let key = this.GetClusterKey(gridname, clustername);
                if (key in this.clusterObjects) {
                    if (nodeinstanceid in this.clusterObjects[key]) {
                        delete this.clusterObjects[key][nodeinstanceid];
                    }
                }
            }

            CopyClusterProxies(gridname, clustername) {
                let key = this.GetClusterKey(gridname, clustername);
                return (key in this.clusterProxies) ? this.clusterProxies[key] : null;
            }

            RemoveClusterObject(gridname, clustername, proxy) {
                let key = this.GetClusterKey(gridname, clustername);
                let prxs = proxy.ice_toString();
                if (key in this.clusterProxies) {
                    let len = this.clusterProxies[key].length;
                    for (let i = 0; i < len; ++i) {
                        if (this.clusterProxies[key][i].ice_toString() == prxs) {
                            this.clusterProxies[key].splice(i, 1);
                            return;
                        }
                    }
                }
            }

            QueryConstObjectRemote(reskey, objName, clusterName, gridName, retryTimes = 0) {
                if (retryTimes > 3) {
                    return new Ice.Promise().fail(LXReturnHelper.LXInvokerError('QueryConstObjectRemote: queryobjects failed with too much retry times'));
                }

                // 拷贝，使通信在锁外执行
                let proxies = this.CopyClusterProxies(gridName, clusterName);

                // 确保部署信息存在
                if (proxies == null) {
                    return this.UpdateClusterDeploy(clusterName, gridName).then((r, prxs) => {
                        return this.QueryConstObjectRemoteAsync(reskey, objName, clusterName, gridName, prxs, retryTimes);
                    });
                }

                return this.QueryConstObjectRemoteAsync(reskey, objName, clusterName, gridName, proxies, retryTimes);
            }

            QueryConstObjectRemoteAsync(reskey, objName, clusterName, gridName, proxies, retryTimes) {
                // 随机取节点对象进行业务对象信息查询
                let randnum = this.GetRandom(0, proxies.length - 1);
                let proxynode = proxies[randnum];
                return proxynode.QueryObject(objName, reskey).then((r, prxObject, nodeinst, cacheSecs) => {
                        if (!LXReturnHelper.IsLXSucceed(r)) {
                            console.log('queryuserobject queryobject failed with error:' + r.error + ', msg:' + r.msg + ', objName:' + objName + ', reskey:' + reskey + ', clustername:' + clusterName + ', proxynode:' + proxynode);
                            return new Ice.Promise().fail(r);
                        }

                        // 更新节点对象集合信息
                        let key = this.GetClusterKey(gridName, clusterName);
                        if (!this.clusterObjects[key]) this.clusterObjects[key] = new Object();
                        if (!this.clusterObjects[key][nodeinst]) this.clusterObjects[key][nodeinst] = new Object();
                        this.clusterObjects[key][nodeinst][objName] = prxObject;

                        // 更新资源节点信息
                        // 应该设置过期时间cacheSecs
                        if (reskey) this.constNodes[this.MakeConstNodeKey(reskey, gridName, clusterName, objName)] = nodeinst;
                        return new Ice.Promise().succeed(r, prxObject, nodeinst, cacheSecs);
                    },
                    (e) => {
                        console.log('[exception] queryobjects failed with reskey:' + reskey + ', clustername:' + clusterName + ', recursion exec times:' + retryTimes + 'exception:' + e);

                        // 移除无效代理
                        this.RemoveClusterObject(gridName, clusterName, proxynode);

                        // 递归重新执行
                        return this.QueryConstObjectRemote(reskey, objName, clusterName, gridName, ++retryTimes);
                    });
            }

            GetRandomProxy(gridname, clustername, objname) {
                let key = this.GetClusterKey(gridname, clustername);
                if (key in this.clusterObjects) {
                    // 从map中随机取一个节点
                    let randomnum = this.GetRandom(0, this.clusterObjects[key].length - 1);
                    let index = 0;
                    for (let k in this.clusterObjects[key]) {
                        if (randomnum == index++) {
                            let objects = this.clusterObjects[key][k];
                            if (objname in objects) {
                                return { 'proxy': k, 'nodeinst': objects[objname] };
                            }
                        }
                    }
                }

                return { 'proxy': null, 'nodeinst': null };
            }

            GetClusterKey(gridname, clustername) {
                let o = new Array();
                o[0] = gridname;
                o[1] = clustername;
                return o.toString();
            }

            MakeConstNodeKey(reskey, gridname, clustername, objectname) {
                let hash = md5.create();
                hash.update(reskey);
                hash.update(gridname);
                hash.update(clustername);
                hash.update(objectname);
                return hash.hex();
            }

            // 获取随机数(包含min、max)
            GetRandom(min, max) {
                let range = max - min;
                let rand = Math.random();
                return (min + Math.round(rand * range));
            }
        };

        LXGrid.LXCommunicator = ILXCommunicator;

        exports.LXGrid = LXGrid;
    }
    (typeof(global) !== 'undefined' && typeof(global.process) !== 'undefined' ? module : undefined,
        typeof(global) !== 'undefined' && typeof(global.process) !== 'undefined' ? require : window.Ice.__require,
        typeof(global) !== 'undefined' && typeof(global.process) !== 'undefined' ? exports : window));