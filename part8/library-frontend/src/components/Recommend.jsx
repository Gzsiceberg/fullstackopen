import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS, ME } from '../queries'

const Recommend = (props) => {
  const meResult = useQuery(ME)
  const favoriteGenre = meResult.data?.me?.favoriteGenre

  const booksResult = useQuery(ALL_BOOKS, {
    variables: { genre: favoriteGenre },
    skip: !favoriteGenre || !props.show
  })

  if (!props.show) {
    return null
  }

  if (meResult.loading || booksResult.loading) {
    return <div>loading...</div>
  }

  const books = booksResult.data?.allBooks

  if (!favoriteGenre || !books) {
    return <div>Books not found or user not authenticated</div>
  }

  return (
    <div>
      <h2>recommendations</h2>
      <p>books in your favorite genre <b>{favoriteGenre}</b></p>
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
    </div>
  )
}

export default Recommend
