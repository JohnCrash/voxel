const Sql = require('mssql');
const config = require('./config');

const SQL = Sql.connect(config.sqlserver);
module.exports = function sql(query){
  /*
    //老的连接池方式
    return new Sql.ConnectionPool(config.sqlserver).connect().then(pool=>{
      return pool.request().query(query);
    });
  */
  return SQL.then((pool)=>{return pool.request().query(query)});
}