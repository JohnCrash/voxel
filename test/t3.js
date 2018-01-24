var async = require("async");
var config = require('../server/config');
const Sql = require('mssql');

//较大的查询需要更长的时间传输
config.sqlserver.connectionTimeout = 150000;

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

sql('select * from Tops').then(()=>{
	if(1){
		return sql('select * from Tops');
	}
}).then((r)=>{
	console.info('done!',r);
}).then((rr)=>{
	console.info('done!2',rr);
}).catch((e)=>{
	console.error(e);
});
console.log('start');