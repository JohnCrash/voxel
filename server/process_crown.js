const Sql = require('mssql');
const config = require('./config');

const SQL = Sql.connect(config.sqlserver);
function sql(query){
  /*
    //老的连接池方式
    return new Sql.ConnectionPool(config.sqlserver).connect().then(pool=>{
      return pool.request().query(query);
    });
  */
  return SQL.then((pool)=>{return pool.request().query(query)});
}

//
for( let i = 0;i<201;i++){
    sql(`select count(*) from UserInfo where crown=${i}`).then((result)=>{
        let data = result.recordset;
        if(data && data[0]){
            console.log(i);
            sql(`update Crown set people=${data[0]['']} where count=${i}`);
        }
    }).catch((err)=>{
        console.log(err);
    });
}
