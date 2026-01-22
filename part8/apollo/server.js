const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const connectToDatabase = require('./db')

const resolvers = require('./resolvers')
const typeDefs = require('./schema')

const startServer = async (port) => {
  const MONGODB_URI = process.env.MONGODB_URI
  await connectToDatabase(MONGODB_URI)

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  })

  startStandaloneServer(server, {
    listen: { port },
  }).then(({ url }) => {
    console.log(`Server ready at ${url}`)
  })
}

module.exports = startServer
