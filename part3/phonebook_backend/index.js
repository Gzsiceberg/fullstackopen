require('dotenv').config()
const express = require('express')
const Phonebook = require('./models/phonebook')
const app = express()
app.use(express.json())

app.use(express.static('dist'))

const morgan = require('morgan')
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    Phonebook.findById(id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => {
            console.log(error)
            response.status(500).end()
        })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    Phonebook.findByIdAndDelete(id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => {
            console.log(error)
            response.status(500).end()
        })
})

app.get('/api/persons', (request, response) => {
    Phonebook.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/info', (request, response) => {
    Phonebook.find({}).then(persons => {
        const date = new Date()
        const info = `<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`
        response.send(info)
    })
})

app.put('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const body = request.body

    const person = {
        name: body.name,
        number: body.number,
    }

    Phonebook.findByIdAndUpdate(id, person, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => {
            console.log(error)
            response.status(500).end()
        })
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body) {
        return response.status(400).json({
            error: 'request body missing'
        })
    }

    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }

    if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }

    const person = new Phonebook({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    }).catch(error => {
        console.log(error)
        response.status(500).end()
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})