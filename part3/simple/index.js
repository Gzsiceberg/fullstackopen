require('dotenv').config()
const express = require('express')
const Note = require('./models/note')

const app = express()
app.use(express.json())

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes/:id', (request, response) => {
    const id = request.params.id
    Note.findById(id).then(note => {
        response.json(note)
    })
})

app.delete('/api/notes/:id', (request, response) => {
    const id = request.params.id
    Note.findByIdAndDelete(id).then(() => {
        response.status(204).end()
    }).catch(error => {
        console.log(error)
        response.status(204).end()
    })
})

app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes)
    })
})

app.post('/api/notes', (request, response) => {
    const body = request.body

    if (!body.content) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const note = new Note({
        content: body.content,
        important: body.important || false,
    })

    // notes = notes.concat(note)
    note.save().then(savedNote => {
        response.json(savedNote)
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})