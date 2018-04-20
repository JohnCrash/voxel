// 添加引用
const Ice = require('ice').Ice;
const {
    LXSliceInvokerAsset,
    LXSliceInvokerLottery,
    LXSliceInvokerUser,
    LXSliceInvokerPush,
    LXReturnHelper
} = require('./index.js').LXGrid;

const { Asset } = require('./index.js').LXGrid.Main;

(function() {

    TestPush();
    //setInterval(() => GetLotteryDrawList(), 2000);
    // TestAsset()
    //ModifyLotteryDraw();
    // GetLotteryDrawList();
    // CreateLotteryDraw();
    //DeleteLotteryDraw();
    //GetUserInfo();

}());

function TestPush() {

    // 创建Invoker
    
    // linux
    // LXGrid.Main.txt << Ice.Default.Locator=LXGridMain/Locator:tcp -h 192.168.2.15 -p 4061
    let invoker = new LXSliceInvokerPush("/home/hackett/xconfig/LXGrid.Main.txt");

    // windows 默认读取C:\\xconfig\\grid2\\LXGrid.Main.txt
    //let invoker = new LXSliceInvokerPush();

    // 1. 用户推送
    let users = new Array();
    users.push(149880);

    invoker.PushUserMessage(
        1104,		// 应用ID
        users,		// 用户ids
        '测试用户推送消息',	// 消息
        '')		// 不用填
        .then((r) => {
            if (LXReturnHelper.IsLXSucceed(r)) {
                console.log('succeed');
            }
        },
        (e) => {
            console.log('exception:', e);
        });

    // 2. 地区推送
    // appid, areaid, roles, grades, message, context, member
    let roles = new Array();
    roles.push(1,2,3); // 学生、老师、家长

    let grades = new Array();
    grades.push(1, 2, 3,4,5,6); // 1-6年级

    invoker.PushAreaMessage(
        1133,		// 应用ID
        384,		// 香港地区 0:全国推送
        roles,      // 身份
        grades,     // 年级
        '测试香港推送消息',	// 消息
        '',         // 不用填
        1133)		// APP1133的会员用户
        .then((r) => {
            if (LXReturnHelper.IsLXSucceed(r)) {
                console.log('succeed');
            }
        },
        (e) => {
            console.log('exception:', e);
        });
}

function TestAsset()
{
    // 创建Invoker
    // config_file_full_name为配置文件全路径名
    // LXGrid.Main.txt << Ice.Default.Locator=LXGridMain/Locator:tcp -h 192.168.2.15 -p 4061
    let invoker = new LXSliceInvokerAsset("/home/hackett/xconfig/LXGrid.Main.txt");

    // 访问接口
    var paras = new Asset.LXAssetParameters();
    paras.app_id = 1123;
    paras.sub_id = 0;
    paras.currecy = Asset.LXEnumCurrecy.LXCurrecy_JINB;

    invoker.AssetChange(
	paras,		// 应用及资产类型
	149880,		// 用户id
	new Ice.Long(0, 500),		// 增加金币5个
	Asset.LXEnumAssetChangeState.LXEnumAssetChangeState_Income,		// 2为减少,  1是增加
	'游戏解锁奖励金币',	// 个人资产明细中会显示的内容
	'')		// 不用填
	.then((r) => {
        if (LXReturnHelper.IsLXSucceed(r)) {
            console.log('succeed');
        }
    },
    (e) => {
        console.log('exception:', e);
    });
}

function ReturnExpireExchangeTicket() {
    // 创建Invoker
    let invoker = new LXSliceInvokerLottery();
    
        // 访问接口
        invoker.ReturnExpireExchangeTicket(1).then((r) => {
                console.log(r);
            },
            (e) => {
                console.log('exception:', e);
            });
}

function SetCashInfo() {
    // 创建Invoker
    let invoker = new LXSliceInvokerUser();

    // 访问接口
    invoker.SetCashInfo(149880).then((r, userinfo) => {
            console.log(r);
            console.log(userinfo);
            console.log(userinfo.gender.value);
        },
        (e) => {
            console.log('exception:', e);
        });
}


function GetUserInfo() {
    // 创建Invoker
    let invoker = new LXSliceInvokerUser();

    // 访问接口
    invoker.GetUserInfo(149880).then((r, userinfo) => {
            console.log(r);
            console.log(userinfo);
            console.log(userinfo.gender.value);
        },
        (e) => {
            console.log('exception:', e);
        });
}

function ModifyLotteryDraw() {
    // 创建Invoker
    let invoker = new LXSliceInvokerLottery();

    let userid = 1;
    let comm = new Object();
    comm.name = '测试创建活动'; // 活动名称
    comm.describe = '测试活动规则'; // 活动规则
    comm.starttime = new Ice.Long(0, 1501750554); // 开始时间
    comm.endtime = new Ice.Long(0, 1512061261); // 结束时间
    comm.salecoins = 1000; // 兑换金币数量(0为不支持兑换)
    comm.salenum = 3; // 每人每天兑换次数
    comm.reward = 0; // 奖励类型(LXEnumTicketRewardType)

    let prizes = new Array();

    for (let i = 0; i < 6; ++i) {
        let pz = new Object();
        pz.name = i + '等奖'; // 等级
        pz.describe = '奖品'; // 名称
        pz.type = i < 4 ? 1 : (i > 4 ? 0 : 2); // 类型(LXEnumPrizeType)
        pz.totalnum = 1 + (10 * i); // 总数
        pz.pernum = 1; // 每份数量
        pz.lavenum = 1 + (10 * i); // 剩余份数
        pz.preimage = ''; // 预览图
        pz.detimage = ''; // 详情图
        pz.rate = (1 / 6); // 中奖概率
        pz.presets = []; // 出奖时间列表(日期、数量)
        prizes.push(pz);
    }

    // 访问接口
    invoker.ModifyLotteryDraw(9, comm, prizes).then((r, lotteryid) => {
            if (LXReturnHelper.IsLXSucceed(r)) {
                console.log('lotteryid:' + lotteryid);
            }
        },
        (e) => {
            console.log('exception:', e);
        });
}

function DeleteLotteryDraw() {
    // 创建Invoker
    let invoker = new LXSliceInvokerLottery();

    // 访问接口
    invoker.DeleteLotteryDraw(16).then((r) => {
            if (LXReturnHelper.IsLXSucceed(r)) {
                console.log(r);
            }
        },
        (e) => {
            console.log('exception:', e);
        });
}

function CreateLotteryDraw() {
    // 创建Invoker
    let invoker = new LXSliceInvokerLottery();

    let userid = 1;
    let comm = new Object();
    comm.name = '测试创建活动'; // 活动名称
    comm.describe = '测试活动规则'; // 活动规则
    comm.starttime = new Ice.Long(0, 1501750554); // 开始时间
    comm.endtime = new Ice.Long(0, 1512061261); // 结束时间
    comm.salecoins = 1000; // 兑换金币数量(0为不支持兑换)
    comm.salenum = 3; // 每人每天兑换次数
    comm.reward = 0; // 奖励类型(LXEnumTicketRewardType)

    let prizes = new Array();

    for (let i = 0; i < 6; ++i) {
        let pz = new Object();
        pz.name = i + '等奖'; // 等级
        pz.describe = '奖品'; // 名称
        pz.type = i < 4 ? 1 : (i > 4 ? 0 : 2); // 类型(LXEnumPrizeType)
        pz.totalnum = 1 + (10 * i); // 总数
        pz.pernum = 1; // 每份数量
        pz.lavenum = 1 + (10 * i); // 剩余份数
        pz.preimage = ''; // 预览图
        pz.detimage = ''; // 详情图
        pz.rate = i === 5 ? 0.5 : 0.1; // 中奖概率
        pz.presets = []; // 出奖时间列表(日期、数量)
        prizes.push(pz);
    }

    // 访问接口
    invoker.CreateLotteryDraw(userid, comm, prizes).then((r, lotteryid) => {
            if (LXReturnHelper.IsLXSucceed(r)) {
                console.log('lotteryid:' + lotteryid);
            }
        },
        (e) => {
            console.log('exception:', e);
        });
}

function GetLotteryDrawList() {
    // 创建Invoker
    let invoker = new LXSliceInvokerLottery();

    // 访问接口
    invoker.GetLotteryStatCount(1).then((r, stat) => {
            console.log(r);

            console.log(stat.ticketcount); // 总奖券数
            console.log(stat.usercount);   // 参与人数

            // 奖项统计
            stat.prizecount.forEach((k) => {
                console.log(k); // 奖项ID
                console.log('奖项:' +k + '数量:' +stat.prizecount.get(k)); // 出奖数量
            });
        },
        (e) => {
            console.log('exception:', e);
        });
}