const express = require('express')
const middleware = require('./utils/middleware')
const router = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const mongoose = require('mongoose')

const app = express()
const logger = require('./utils/logger')
const config = require('./utils/config')

logger.info('connecting to mongoDB')
mongoose.connect(config.MONGODB_URI, { family: 4 }).then(() => {
    logger.info('connected to MongoDB')
}).catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
})

app.use(express.static('dist'))
app.use(express.json())

app.use(middleware.requestLogger)

app.use('/api/blogs', router)
app.use('/api/users', userRouter)

// handler of requests with unknown endpoint
app.use(middleware.unknownEndpoint)

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(middleware.errorHandler)

module.exports = app