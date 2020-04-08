const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const mongoose = require('mongoose')

const graphQlSchema = require('./graphql/schema')
const graphQlResolvers = require('./graphql/resolvers')

const app = express()



app.use(bodyParser.json())

app.use('/graphql', graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
}))

mongoose.connect(`mongodb+srv://${
    process.env.MONGO_USER}:${
    process.env.MONGO_PASSWORD
    }@eventplanner-eaevz.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
).then(_ =>
{

})
.catch(err =>
{
    console.log(err)
})

const port = process.env.PORT || 5000
app.listen(port, _ => console.log(`server listening on port ${port}`))
