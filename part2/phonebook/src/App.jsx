import { useEffect } from 'react'
import { useState } from 'react'
import personService from './service'

const Persons = (props) => {
  const persons = props.persons
  const delPerson = props.delPerson
  return (
    <div>
      {persons.map(person =>
        <p key={person.name}>{person.name} {person.number} <button onClick={() => delPerson(person.id)}>delete</button></p>
      )}
    </div>)
}

const Filter = (props) => {
  return (
    <div>
      filter shown with: <input value={props.newFilter} onChange={props.handleFilterChange} />
    </div>
  )
}

const PersonForm = (props) => {
  return (
    <form onSubmit={props.onSubmit}>
      <div>
        name: <input value={props.newName} onChange={props.handleNameChange} />
      </div>
      <div>number: <input value={props.newPhoneNumber} onChange={props.handlePhoneNumberChange} /></div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')

  const hook = () => {
    console.log('effect')
    personService.getAll()
      .then(data => {
        console.log('promise fulfilled')
        setPersons(data)
      })
  }

  useEffect(hook, [])


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
    personService.create(personObject).then(returnedPerson => {
      setPersons(persons.concat(returnedPerson))
    })
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

  const delPerson = (id) => {
    personService.del(id).then(() => {
      console.log('deleted successfully')
      setPersons(persons.filter(person => person.id !== id))
    })
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />

      <PersonForm
        onSubmit={onSubmit}
        newName={newName}
        handleNameChange={handleNameChange}
        newPhoneNumber={newPhoneNumber}
        handlePhoneNumberChange={handlePhoneNumberChange}
      />

      <h2>Numbers</h2>
      <Persons persons={personsToShow} delPerson={delPerson} />
    </div>
  )
}

export default App