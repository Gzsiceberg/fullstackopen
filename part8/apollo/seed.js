const mongoose = require('mongoose')
require('dotenv').config()
const Author = require('./models/author')
const Book = require('./models/book')
const connectToDatabase = require('./db')

const authors = [
  { name: 'Robert Martin', born: 1952 },
  { name: 'Martin Fowler', born: 1963 },
  { name: 'Fyodor Dostoevsky', born: 1821 },
  { name: 'Joshua Kerievsky' },
  { name: 'Sandi Metz' },
]

const books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    genres: ['refactoring', 'patterns']
  },
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    genres: ['classic', 'crime']
  },
  {
    title: 'Demons',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    genres: ['classic', 'revolution']
  },
]

const seed = async () => {
  console.log('Seeding database...')
  
  try {
    await connectToDatabase(process.env.MONGODB_URI)
    
    console.log('Clearing existing data...')
    await Author.deleteMany({})
    await Book.deleteMany({})
    
    console.log('Creating authors...')
    for (const authorData of authors) {
      const author = new Author(authorData)
      await author.save()
    }
    
    console.log('Creating books...')
    for (const bookData of books) {
      const author = await Author.findOne({ name: bookData.author })
      const book = new Book({
        ...bookData,
        author: author._id
      })
      await book.save()
    }
    
    console.log('Database seeded successfully!')
  } catch (error) {
    console.error('Error seeding database:', error)
  } finally {
    mongoose.connection.close()
  }
}

seed()
