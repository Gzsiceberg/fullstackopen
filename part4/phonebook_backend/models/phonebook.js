const mongoose = require('mongoose')

const phonebookSchema = new mongoose.Schema({
    name: { type: String, required: true, minLength: 3 },
    number: { type: String, required: true, minLength: 8 },
})

phonebookSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        // delete returnedObject.id
        delete returnedObject.__v
    }
})

const Phonebook = mongoose.model('Phonebook', phonebookSchema)
module.exports = Phonebook