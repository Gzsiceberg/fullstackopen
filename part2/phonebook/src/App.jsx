import { useState } from 'react'

const Persons = (props) => {
  let persons = props.persons
  return (
    <div>
      {persons.map(person =>
        <p key={person.name}>{person.name}</p>
      )}
    </div>)
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ])
  const [newName, setNewName] = useState('')

  let handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  let onSubmit = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName
    }
    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }
    setPersons(persons.concat(personObject))
    setNewName('')
  }
  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={onSubmit}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <Persons persons={persons} />
    </div>
  )
}

export default App