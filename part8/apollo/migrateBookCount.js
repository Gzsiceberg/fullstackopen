/**
 * Migration script to initialize bookCount for existing authors
 * Run this once to update all authors with their correct book counts
 * 
 * Usage: node migrateBookCount.js
 */

require('dotenv').config()
const mongoose = require('mongoose')
const Author = require('./models/author')
const Book = require('./models/book')

const MONGODB_URI = process.env.MONGODB_URI

async function migrate() {
  console.log('Connecting to MongoDB...')
  await mongoose.connect(MONGODB_URI)
  console.log('Connected to MongoDB')

  const authors = await Author.find({})
  console.log(`Found ${authors.length} authors to update`)

  for (const author of authors) {
    const bookCount = await Book.countDocuments({ author: author._id })
    author.bookCount = bookCount
    await author.save()
    console.log(`Updated ${author.name}: bookCount = ${bookCount}`)
  }

  console.log('Migration complete!')
  await mongoose.connection.close()
  process.exit(0)
}

migrate().catch(err => {
  console.error('Migration failed:', err)
  process.exit(1)
})
