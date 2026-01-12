const express = require('express')
const middleware = require('./utils/middleware')
const router = require('./controllers/blogs')
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

const morgan = require('morgan')
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use('/api/blogs', router)

// handler of requests with unknown endpoint
app.use(middleware.unknownEndpoint)

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(middleware.errorHandler)

module.exports = app