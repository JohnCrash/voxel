const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const bodyParser = require('body-parser');
const mixSchema = require('./mixschema');
const rootquery = require('./rootquery');
const sta = require('./sta');
const game = require('./game');
const mgr = require('./qgl_mgr');

const schema = makeExecutableSchema(mixSchema(rootquery,game,mgr,sta));

module.exports  = function(app){
    //app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
    app.use('/graphql', bodyParser.json(), (req,res,next)=>{
        graphqlExpress({ schema,context:{req,res} })(req,res,next);
    });
    app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
}