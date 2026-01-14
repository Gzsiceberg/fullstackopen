const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const Users = require('../models/users')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const bcrypt = require('bcrypt')
const api = supertest(app)

beforeEach(async () => {
    // Clear and set up initial data if necessary
    await Users.deleteMany({})
    const passwordsHash = await bcrypt.hash('sekret', 10)
    const user = new Users({ username: 'root', name: 'Superuser', passwordHash: passwordsHash })
    await user.save()
})

const usersInDb = async () => {
    const users = await Users.find({})
    return users.map(u => u.toJSON())
}

describe('when there is initially one user in db', () => {
    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await usersInDb()

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await usersInDb()
        assert(usersAtEnd.length, usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await usersInDb()

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await usersInDb()
        assert(result.body.error.includes('expected `username` to be unique'))

        assert(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if password is too short', async () => {
        const usersAtStart = await usersInDb()

        const newUser = {
            username: 'testuser',
            name: 'Test User',
            password: 'ab',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        assert(result.body.error.includes('Password must be at least 3 characters long'))

        const usersAtEnd = await usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
})


after(async () => {
    await mongoose.connection.close()
})