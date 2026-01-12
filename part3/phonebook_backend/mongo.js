const mongoose = require('mongoose')

const argCount = process.argv.length

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://csgu_db_user:${password}@cluster0.wcyvzlz.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url, { family: 4 })
console.log("connect successfully.")

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

  entry.save().then(result => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
  return
}

Phonebook.find({}).then(result => {
  result.forEach(entry => {
    console.log(entry)
  })
  mongoose.connection.close()
})