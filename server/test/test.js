const assert = require('assert');
const request = require('supertest');
const app = require('../app');
const config = require('../config');
const Sql = require('mssql');
//const SQL = Sql.connect(config.sqlserver);
/**
 * 这里我使用本地数据库操作营造测试环境
 */
function sql(query){
    return new Sql.ConnectionPool(config.sqlserver).connect().then(pool=>{
        return pool.request().query(query);
      });
  //return SQL.then((pool)=>{return pool.request().query(query)});
}

describe('提示接口',function(){
    const uid = 144969;
    let lv = 10;
    let tipcooldown;

    /**
     * 测试接口/users/lvtips
     * 直接将tipcooldown时间设置上，然后期待返回cooldown并且比较cooldown是否正确
     */
    function init(sec,tipcd,tipbit){
        tipcd = tipcd || 0;
        tipbit = tipbit || 0;
        return sql(`select getdate()`).then((result)=>{
            let c = result.recordset[0][""];
            c.setSeconds(c.getSeconds()+sec);
            tipcooldown = c.toISOString().split('T').join(' ').slice(0,-1);
            return Promise.all([sql(`update UserInfo set tiplv=${lv},tipcooldown='${tipcooldown}' where uid=${uid}`),
            sql(`update Tips set tipcd=${tipcd},tipbit=${tipbit} where uid=${uid} and lv=${lv}`)]);
        });
    }
    let sect = [1,59,120,3599,3600,3700,7200,100,300,99,223];

    describe('测试倒计时是否正确 /users/lvtips',function(){
        for(let i=0;i<10;i++){
            let sec = sect[i];
            it(`使用lvtips取的提示信息倒计时 ${sec}s`,function(done){
                init(sec).then(()=>{
                    request(app).
                    post('/users/lvtips').
                    send({uid}).
                    expect(200).
                    expect('Content-Type', /json/).
                    end(function(err,res){
                        /**
                         * 确定cooldown要等10,haright等于false,cdate
                         */
                        assert(res.body.result==='ok','result必须等于ok');
                        assert(res.body.cooldown!==undefined,'cooldown必须存在');
                        assert(res.body.cooldown<=sec&&res.body.cooldown>sec-3,`cooldown返回不正确的值，期待${sec}返回${res.body.cooldown}`);
                        assert(res.body.cdate,'cdate是数据库的当前时间');
                        assert(res.body.tipcd===0,'tipcd必须等于0');
                        assert(res.body.tipbit===0,'tipbit必须等于0');
                        assert(res.body.lv===lv,`lv必须等于${lv}`);
                        assert(!res.body.hasright,`冷却阶段无权再次点时间解锁`);
                        done(err);
                    });
                });
            });
        }//for
    });//describe

    const tip_cds = [72,24,6,3/60]; //提示级别对应的等待时间
    describe('测试是否拥有测试权限 /users/lvtips',function(){
        for(let i=0;i<4;i++){
            let tipcd = i;
            it(`新的一天并且计时结束，拥有权限 ${tipcd}`,function(done){
                let sec = -2;
                init(sec,tipcd).then(()=>{
                    request(app).
                    post('/users/lvtips').
                    send({uid,lv:10}).
                    expect(200).
                    expect('Content-Type', /json/).
                    end(function(err,res){
                        /**
                         * 确定cooldown要等10,haright等于false,cdate
                         */
                        assert(res.body.result==='ok','result必须等于ok');
                        assert(res.body.cooldown!==undefined,'cooldown必须存在');
                        assert(res.body.cdate,'cdate是数据库的当前时间');
                        assert(res.body.cooldown<0,`cooldown返回不正确的值，期待${sec}返回${res.body.cooldown}`);
                        //assert(res.body.tipcd===tipcd,`tipcd必须等于${tipcd}`);
                        assert(res.body.tipbit===0,'tipbit必须等于0');
                        assert(res.body.lv===10,`lv必须等于10`);
                        if(i<2)
                            assert(res.body.hasright,`冷却阶段结束有权进行时间解锁`);
                        else
                            assert(!res.body.hasright,`冷却阶段结束有权进行时间解锁`);
                        done(err);
                    });
                });
            });   //it
        }
        //
        it(`新的一天并且计时结束，拥有权限 ${2}`,function(done){
            let sec = -24*3600-6*60;
            let tipcd = 2;
            init(sec,tipcd).then(()=>{
                request(app).
                post('/users/lvtips').
                send({uid,lv:10}).
                expect(200).
                expect('Content-Type', /json/).
                end(function(err,res){
                    /**
                     * 确定cooldown要等10,haright等于false,cdate
                     */
                    assert(res.body.result==='ok','result必须等于ok');
                    assert(res.body.cooldown!==undefined,'cooldown必须存在');
                    assert(res.body.cdate,'cdate是数据库的当前时间');
                    assert(res.body.cooldown<0,`cooldown返回不正确的值，期待${sec}返回${res.body.cooldown}`);
                    //assert(res.body.tipcd===tipcd,`tipcd必须等于${tipcd}`);
                    assert(res.body.tipbit===0,'tipbit必须等于0');
                    assert(res.body.lv===10,`lv必须等于10`);
                    assert(res.body.hasright,`冷却阶段结束有权进行时间解锁`);
                    done(err);
                });
            });
        });   //it        
    });
    /*
    describe('提示接口 /users/opentips',function(){
        let sec = -24*3600-6*60;
        let tipcd = 2;
        it(`使用时间解锁`,function(done){
            init(sec,tipcd).then(()=>{
                request(app).
                post('/users/opentips').
                send({uid,lv:10,tiplv:0}).
                expect(200).
                expect('Content-Type', /json/).
                end(function(err,res){
                    assert(res.body.result==='ok','result必须等于ok');
                    done(err);
                });
            });
        });
    });  */   
});

