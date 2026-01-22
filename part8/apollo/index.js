const startServer = require('./server')
require('dotenv').config()

const port = process.env.PORT || 4000

startServer(port)
