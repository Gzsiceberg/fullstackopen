import { useQuery, useMutation } from '@apollo/client/react'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'
import { useState } from 'react'

const Authors = (props) => {
  const authorsResult = useQuery(ALL_AUTHORS)
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    skip: !props.show,
    cache: 'cache-and-network'
  })

  if (!props.show) {
    return null
  }

  if (authorsResult.loading) {
    return <div>loading...</div>
  }

  if (authorsResult.error) {
    return <div>Error: {authorsResult.error.message}</div>
  }

  const authors = authorsResult.data.allAuthors
  // Derive selected name: use state if set, otherwise default to first author
  const selectedName = name || (authors.length > 0 ? authors[0].name : '')

  const submit = async (event) => {
    event.preventDefault()

    console.log('update author...')
    await editAuthor({ variables: { name: selectedName, setBornTo: parseInt(born) } })

    setName('')
    setBorn('')
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {props.token && (
        <>
          <h3>Set birthyear</h3>
          <form onSubmit={submit}>
            <div>
              name
              <select value={selectedName} onChange={({ target }) => setName(target.value)}>
                {authors.map((a) => (
                  <option key={a.id} value={a.name}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              born
              <input
                value={born}
                onChange={({ target }) => setBorn(target.value)}
              />
            </div>
            <button type="submit">update author</button>
          </form>
        </>
      )}
    </div>
  )
}

export default Authors
