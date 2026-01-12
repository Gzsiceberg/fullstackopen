import { useEffect } from 'react'
import { useState } from 'react'
import personService from './service'
import service from './service'

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

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  return (
    <div style={{
      color: type === 'error' ? 'red' : 'green',
      background: 'lightgrey',
      fontSize: 20,
      borderStyle: 'solid',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10
    }}>
      {message}
    </div>
  )
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
  const [errorMessage, setErrorMessage] = useState(null)
  const [messageType, setMessageType] = useState('error')

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
      const id = persons.find(person => person.name === newName).id
      window.confirm("This name already exists in the phonebook. Do you want to update the number?") &&
        service.update(id, personObject).then(returnedPerson => {
          setPersons(persons.map(person => person.id !== id ? person : returnedPerson))
          setMessageType('success')
          setErrorMessage(`Updated ${newName}`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        }).catch(error => {
          setMessageType('error')
          setErrorMessage(error.response?.data?.error || `the person '${newName}' was already deleted from server`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
          setPersons(persons.filter(person => person.id !== id))
        })
      setNewName('')
      setNewPhoneNumber('')
      return
    }
    personService.create(personObject).then(returnedPerson => {
      setPersons(persons.concat(returnedPerson))
      setMessageType('success')
      setErrorMessage(`Added ${newName}`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }).catch(error => {
      console.log(error.response.data)
      setMessageType('error')
      setErrorMessage(error.response.data.error)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
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
    window.confirm('Are you sure you want to delete this person?') && personService.del(id).then(() => {
      console.log('deleted successfully')
      setPersons(persons.filter(person => person.id !== id))
    })
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={errorMessage} type={messageType} />
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