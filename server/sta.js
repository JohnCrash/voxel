const sql = require('./sql');
/**
 * 查询收入
 * query 会被组合到Query中去
 */
const query = `
    income(lastday:Int=30):Income!
    incomeDistribLv:[DistribLv]!
    dau(lastday:Int=30):[Dau]!
`;
const typeDefs = `
    type Income{
        total:Int,
        income:[DayIncome]!,
    }
    type DayIncome{
        date:String,
        unlock:Int,
        tips:Int
    }
    type DistribLv{
        lv:Int,
        gold:Int
    }
    type Dau{
        date:String,
        login:Int,
        submit:Int,
        click:Int,
        slogin:Int,
        ssubmit:Int
    }
`;
function sqlDateString(d){
    return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
}
const resolvers = {
    Query:{
        income:(parent,{lastday},context)=>{
            return Promise.all([sql(`select * from Unlock`),sql(`select * from DayIncome where DateDiff(DD,date,getdate())<=${lastday}`)]).then(([total,income])=>{
                return {total:total.recordset[0]?total.recordset[0].gold_total:0,income:income.recordset};
            });
        },
        incomeDistribLv:()=>{
            return sql(`select * from DistribLv`).then(result=>result.recordset);
        },
        dau:(parent,{lastday},context)=>{
            return sql(`select * from StaAU where DateDiff(DD,date,getdate())<=${lastday} order by date`).then(result=>result.recordset);
        }
    },
    Dau:{
        date:parent=>sqlDateString(parent.date),
        login:parent=>parent.login,
        submit:parent=>parent.submit,
        click:parent=>parent.click,
        slogin:parent=>parent.slogin,
        ssubmit:parent=>parent.ssubmit
    },
    Income:{
        total:(parent)=>{
            return parent.total;
        },
        income:(parent)=>{
            return parent.income;
        }
    },
    DayIncome:{
        date:(parent,args,context)=>{
            return sqlDateString(parent.date);
        },
        unlock:(parent,args,context)=>{
            return parent.unlock;
        },
        tips:(parent,args,context)=>{
            return parent.tips;
        }
    },
    DistribLv:{
        lv:(parent,args,context)=>{
            return parent.lv;
        },
        gold:(parent,args,context)=>{
            return parent.gold;
        }
    }
};

module.exports = {
    typeDefs,
    resolvers,
    query
};