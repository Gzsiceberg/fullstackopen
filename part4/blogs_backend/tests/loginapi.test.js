const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const Users = require('../models/users')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const bcrypt = require('bcrypt')
const api = supertest(app)

beforeEach(async () => {
    // Clear and set up initial data
    await Users.deleteMany({})
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new Users({
        username: 'root',
        name: 'Superuser',
        passwordHash
    })
    await user.save()
})

describe('login functionality', () => {
    test('succeeds with valid credentials', async () => {
        const loginCredentials = {
            username: 'root',
            password: 'sekret',
        }

        const result = await api
            .post('/api/login')
            .send(loginCredentials)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        assert(result.body.token)
        assert.strictEqual(result.body.username, 'root')
        assert.strictEqual(result.body.name, 'Superuser')
    })

    test('fails with incorrect password', async () => {
        const loginCredentials = {
            username: 'root',
            password: 'wrongpassword',
        }

        const result = await api
            .post('/api/login')
            .send(loginCredentials)
            .expect(401)
            .expect('Content-Type', /application\/json/)

        assert.strictEqual(result.body.error, 'invalid username or password')
        assert(!result.body.token)
    })

    test('fails with non-existent username', async () => {
        const loginCredentials = {
            username: 'nonexistent',
            password: 'somepassword',
        }

        const result = await api
            .post('/api/login')
            .send(loginCredentials)
            .expect(401)
            .expect('Content-Type', /application\/json/)

        assert.strictEqual(result.body.error, 'invalid username or password')
        assert(!result.body.token)
    })

    test('fails when username is missing', async () => {
        const loginCredentials = {
            password: 'sekret',
        }

        const result = await api
            .post('/api/login')
            .send(loginCredentials)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        assert.strictEqual(result.body.error, 'username and password required')
        assert(!result.body.token)
    })

    test('fails when password is missing', async () => {
        const loginCredentials = {
            username: 'root',
        }

        const result = await api
            .post('/api/login')
            .send(loginCredentials)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        assert.strictEqual(result.body.error, 'username and password required')
        assert(!result.body.token)
    })

    test('token can be used to verify user identity', async () => {
        const loginCredentials = {
            username: 'root',
            password: 'sekret',
        }

        const result = await api
            .post('/api/login')
            .send(loginCredentials)
            .expect(200)

        const token = result.body.token
        assert(token)

        // Verify token structure (JWT has 3 parts separated by dots)
        const parts = token.split('.')
        assert.strictEqual(parts.length, 3)
    })
})

after(async () => {
    await mongoose.connection.close()
})
