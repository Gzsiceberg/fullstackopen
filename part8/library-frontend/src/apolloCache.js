// function that takes care of manipulating the cache
export const updateCache = (cache, query, addedBook) => {
  cache.updateQuery(query, ({ allBooks }) => {
    const bookExists = allBooks.some(b => b.id === addedBook.id)
    if (bookExists) {
      return { allBooks }
    }
    return {
      allBooks: allBooks.concat(addedBook)
    }
  })
}