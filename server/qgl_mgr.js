const sql = require('./sql');
const fetch = require('node-fetch');
/**
 * 管理界面
 */
const query = `
    myclass:[class_info]!
    mystudent(clsid:Int!):[student_info]!
`;
const typeDefs = `
    type class_info{
        name:String,
        clsid:Int
    }
    type student_info{
        name:String,
        lastcommit:String,
        olv:Int
    }
`;

const resolvers = {
    Query:{
        myclass:(root,args,context)=>{
            let cc2 = context.req.cookies['cc2'];
            let uid = context.req.cookies['uid'];
            return fetch(`https://api.ljlx.com/platform/class/getteacherclasslist?uid=${uid}`,{
                method:'GET',
                credentials: 'include',
                headers: {
                  'Content-Type': 'application/json',
                  'Cookie':cc2,
                }
              }).then(function(responese){
                return responese.json();
              }).then(function(json){
                if(json.result==0 && json.data && json.data.classes){
                    return json.data.classes.map((item)=>{
                        return {name:item.name,clsid:item.class_id};
                    });
                }else{
                    return [];
                }
              }).catch(function(e){
                  return [];
              });
        },
        mystudent:(root,{clsid},context)=>{
            return sql(`select Top 100 UserName,lastcommit,olv from UserInfo where cls=${clsid}`).then(result=>result.recordset);
        }
    },
    class_info:{
        name:(root,args,context)=>{
            return root?root.name:'';
        },
        clsid:(root,args,context)=>{
            return root?root.clsid:-1;
        }
    },
    student_info:{
        name:(root,args,context)=>{
            return root.UserName.trim();
        },
        lastcommit:(root,args,context)=>{
            return root.lastcommit;
        },
        olv:(root,args,context)=>{
            return root.olv;
        }
    }
};

module.exports = {
    typeDefs,
    resolvers,
    query
};