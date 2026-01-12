const express = require('express')
const middleware = require('./utils/middleware')
const phonebooksRouter = require('./controllers/phonebooks')

const app = express()
app.use(express.static('dist'))
app.use(express.json())

const morgan = require('morgan')
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.use('/api/persons', phonebooksRouter)

app.get('/info', (request, response, next) => {
    const Phonebook = require('./models/phonebook')
    Phonebook.find({}).then(persons => {
        const date = new Date()
        const info = `<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`
        response.send(info)
    }).catch(error => next(error))
})

// handler of requests with unknown endpoint
app.use(middleware.unknownEndpoint)

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(middleware.errorHandler)

module.exports = app