const mongoose = require('mongoose')

const password = process.argv[2]

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 }).then(() => {
    console.log("connected to MongoDB")
}).catch((error) => {
    console.log("error connecting to MongoDB:", error.message)
})

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
})

noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.id
        delete returnedObject.__v
    }
})

const Note = mongoose.model('Note', noteSchema)
module.exports = Note