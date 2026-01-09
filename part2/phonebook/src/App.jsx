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
    { name: 'Arto Hellas', number: '040-1234567' }
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

  return (
    <div>
      <h2>Phonebook</h2>
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
      <Persons persons={persons} />
    </div>
  )
}

export default App