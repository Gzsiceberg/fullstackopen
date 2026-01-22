import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS } from '../queries'
import { useState } from 'react'

const Books = (props) => {
  const [genre, setGenre] = useState(null)
  
  // Query to get all books for extracting genres
  const allBooksResult = useQuery(ALL_BOOKS)
  
  // Query to get filtered books based on selected genre
  const filteredBooksResult = useQuery(ALL_BOOKS, {
    variables: genre ? { genre } : undefined,
    skip: !props.show,
    fetchPolicy: 'cache-and-network'
  })

  if (!props.show) {
    return null
  }

  // Only show loading if we don't have data yet
  if ((filteredBooksResult.loading && !filteredBooksResult.data) || allBooksResult.loading) {
    return <div>loading...</div>
  }

  if (filteredBooksResult.error) {
    return <div>Error: {filteredBooksResult.error.message}</div>
  }

  const books = filteredBooksResult.data.allBooks
  const allBooks = allBooksResult.data?.allBooks || []

  // Calculate unique genres from all books
  const genres = [...new Set(allBooks.flatMap(b => b.genres))]

  return (
    <div>
      <h2>books</h2>
      
      {genre && <p>in genre <b>{genre}</b></p>}

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
            {books.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div>
        {genres.map(g => (
          <button key={g} onClick={() => setGenre(g)}>{g}</button>
        ))}
        <button onClick={() => setGenre(null)}>all genres</button>
      </div>
    </div>
  )
}

export default Books
