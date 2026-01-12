require('dotenv').config()
const express = require('express')
const Phonebook = require('./models/phonebook')
const logger = require('./utils/logger')
const app = express()
app.use(express.json())
app.use(express.static('dist'))

const morgan = require('morgan')
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Phonebook.findById(id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Phonebook.findByIdAndDelete(id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => {
            next(error)
        })
})

app.get('/api/persons', (request, response, next) => {
    Phonebook.find({}).then(persons => {
        response.json(persons)
    }).catch(error => next(error))
})

app.get('/info', (request, response, next) => {
    Phonebook.find({}).then(persons => {
        const date = new Date()
        const info = `<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`
        response.send(info)
    }).catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    const body = request.body

    Phonebook.findById(id).then(personInDb => {
        if (!personInDb) {
            return response.status(404).end()
        }

        personInDb.number = body.number
        personInDb.name = body.name
        return personInDb.save().then(updatedPerson => response.json(updatedPerson))
    }
    ).catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if (!body) {
        return response.status(400).json({
            error: 'request body missing'
        })
    }

    const person = new Phonebook({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
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

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`)
})
