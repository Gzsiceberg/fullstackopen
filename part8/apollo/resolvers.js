const Book = require('./models/book')
const Author = require('./models/author')

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allAuthors: async () => Author.find({}),
    allBooks: async (parent, args) => {
      if (!args.author && !args.genre) {
        return Book.find({}).populate('author')
      }
      if (args.author && !args.genre) {
        const author = await Author.findOne({ name: args.author })
        if (!author) return []
        return Book.find({ author: author._id }).populate('author')
      }
      if (!args.author && args.genre) {
        return Book.find({ genres: args.genre }).populate('author')
      }
      
      const author = await Author.findOne({ name: args.author })
      if (!author) return []
      return Book.find({ author: author._id, genres: args.genre }).populate('author')
    }
  },
  Author: {
    bookCount: async (parent) => {
      return Book.countDocuments({ author: parent._id })
    }
  },
  Book: {
    author: async (root) => {
      // If author is already populated (it's an object with a name), return it
      if (root.author && root.author.name) {
        return root.author
      }
      // If author is an ID, fetch it
      const author = await Author.findById(root.author)
      return author
    }
  },
  Mutation: {
    addBook: async (parent, args) => {
      let author = await Author.findOne({ name: args.author })
      if (!author) {
        author = new Author({ name: args.author })
        await author.save()
      }
      const book = new Book({ ...args, author: author._id })
      await book.save()
      // Populate author to match return type expectation (though just ID might be enough depending on Book type in schema)
      // The schema says Book.author is String!, so we need the name.
      return book.populate('author')
    },
    editAuthor: async (parent, args) => {
      const author = await Author.findOne({ name: args.name })
      if (!author) {
        return null
      }
      author.born = args.setBornTo
      return author.save()
    }
  }
}

module.exports = resolvers
