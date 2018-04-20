# LXNodeModules JavaScript 

# 使用说明

## 1. 安装LXNodeModules依赖
    执行: npm install -s LXNodeModules@git+http://192.168.2.4:8080/tfs/ljcode/_git/LXNodeModules

## 2. 接口调用
    // 抽奖demo
    const {
        LXSliceInvokerLottery,
        LXReturnHelper
    } = require('./index.js').LXGrid;

    // 创建Invoker
    let invoker = new LXSliceInvokerLottery(config_file_full_name);

    // 访问接口
    invoker.GetLotteryDrawList().then((r, acts) => {
        if (LXReturnHelper.IsLXSucceed(r)) {
            console.log(acts);
        }
    },
    (e) => {
        console.log('exception:', e);
    });

# 项目依赖

    ice: 3.6.1
    js-md5: lastest
