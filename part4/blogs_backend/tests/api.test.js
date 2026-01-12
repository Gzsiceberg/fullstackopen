const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const Blogs = require('../models/blogs')
const supertest = require('supertest')
const app = require('../app')
const { assert } = require('node:console')
const api = supertest(app)

beforeEach(async () => {
    // Clear and set up initial data if necessary
    await Blogs.deleteMany({})
    const initialBlogs = [
        {
            title: 'First Blog',
            author: 'Author One',
            url: 'http://example.com/1',
            likes: 10
        },
        {
            title: 'Second Blog',
            author: 'Author Two',
            url: 'http://example.com/2',
            likes: 20
        }
    ]
    await Blogs.insertMany(initialBlogs)
})

test('get blogs', async () => {
    const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    const blogs = response.body
    assert(blogs.length === 2)
})

after(async () => {
    await mongoose.connection.close()
})