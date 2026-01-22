const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const connectToDatabase = require('./db')
const jwt = require('jsonwebtoken')
const User = require('./models/user')

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
    context: async ({ req }) => {
      const auth = req ? req.headers.authorization : null
      if (auth && auth.startsWith('Bearer ')) {
        const decodedToken = jwt.verify(
          auth.substring(7), process.env.JWT_SECRET
        )
        const currentUser = await User.findById(decodedToken.id)
        return { currentUser }
      }
    },
  }).then(({ url }) => {
    console.log(`Server ready at ${url}`)
  })
}

module.exports = startServer
