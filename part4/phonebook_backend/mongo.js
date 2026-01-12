const mongoose = require('mongoose')
const logger = require('./utils/logger')

const argCount = process.argv.length

if (process.argv.length < 3) {
    logger.info('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://csgu_db_user:${password}@cluster0.wcyvzlz.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url, { family: 4 }).then(() => {
    logger.info('connected to MongoDB')
}).catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
})

const phonebookSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Phonebook = mongoose.model('Phonebook', phonebookSchema)

if (argCount === 5) {
    const name = process.argv[3]
    const number = process.argv[4]

    const entry = new Phonebook({
        name: name,
        number: number,
    })

    entry.save().then(() => {
        logger.info(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
    return
}

Phonebook.find({}).then(result => {
    result.forEach(entry => {
        logger.info(entry)
    })
    mongoose.connection.close()
})