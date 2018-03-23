const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const bodyParser = require('body-parser');
const mixSchema = require('./mixschema');
const rootquery = require('./rootquery');
const sta = require('./sta');
const game = require('./game');

const schema = makeExecutableSchema(mixSchema(rootquery,game,sta));

module.exports  = function(app){
    app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
    app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
}