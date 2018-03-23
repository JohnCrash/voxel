const {merge} = require('lodash');
/**
 * 合并多个schema接口
 * 将Query查询当成
 */
module.exports = function mixSchema(){
    let typeDefs = [];
    let resolveArray = [];
    let queryStr = 'type Query{\n';
    for(let i=0;i<arguments.length;i++){
        typeDefs.push(arguments[i].typeDefs);
        resolveArray.push(arguments[i].resolvers);
        if(arguments[i].query){
            queryStr += arguments[i].query+'\n';
        }
    }
    queryStr += '}';
    typeDefs.push(queryStr);
    return {
        typeDefs,
        resolvers:merge(...resolveArray)
    };
};