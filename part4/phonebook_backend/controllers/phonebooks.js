const phonebooksRouter = require('express').Router()
const Phonebook = require('../models/phonebook')

phonebooksRouter.get('/', (request, response, next) => {
    Phonebook.find({}).then(persons => {
        response.json(persons)
    }).catch(error => next(error))
})

phonebooksRouter.get('/:id', (request, response, next) => {
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

phonebooksRouter.delete('/:id', (request, response, next) => {
    const id = request.params.id
    Phonebook.findByIdAndDelete(id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => {
            next(error)
        })
})

phonebooksRouter.put('/:id', (request, response, next) => {
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

phonebooksRouter.post('/', (request, response, next) => {
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

module.exports = phonebooksRouter
