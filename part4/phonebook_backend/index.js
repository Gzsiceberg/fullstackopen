const express = require('express')
const logger = require('./utils/logger')
const config = require('./utils/config')
const phonebooksRouter = require('./controllers/phonebooks')
const app = express()
app.use(express.json())
app.use(express.static('dist'))

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

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

// this has to be the last loaded middleware, also all the routes should be registered before this!
const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}
app.use(errorHandler)

const PORT = config.PORT || 3001
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`)
})
