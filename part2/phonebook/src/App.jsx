import { useState } from 'react'

const Persons = (props) => {
  let persons = props.persons
  return (
    <div>
      {persons.map(person =>
        <p key={person.name}>{person.name} {person.number}</p>
      )}
    </div>)
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')

  let handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const [newPhoneNumber, setNewPhoneNumber] = useState('')
  let handlePhoneNumberChange = (event) => {
    setNewPhoneNumber(event.target.value)
  }

  let onSubmit = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newPhoneNumber
    }
    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }
    setPersons(persons.concat(personObject))
    setNewName('')
    setNewPhoneNumber('')
  }

  const [newFilter, setNewFilter] = useState('')
  let handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  let personsToShow = persons
  if (newFilter) {
    personsToShow = persons.filter(person =>
      person.name.toLowerCase().includes(newFilter.toLowerCase())
    )
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <div>
        filter shown with: <input value={newFilter} onChange={handleFilterChange} />
      </div>

      <form onSubmit={onSubmit}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>number: <input value={newPhoneNumber} onChange={handlePhoneNumberChange} /></div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <Persons persons={personsToShow} />
    </div>
  )
}

export default App