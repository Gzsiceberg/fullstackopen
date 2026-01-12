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

test('blog posts have id property instead of _id', async () => {
    const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const blogs = response.body
    assert(blogs.length > 0)

    blogs.forEach(blog => {
        assert(blog.id !== undefined)
        assert(blog._id === undefined)
    })
})

test('a valid blog can be added', async () => {
    const newBlog = {
        title: 'Test Blog Post',
        author: 'Test Author',
        url: 'http://example.com/test',
        likes: 5
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const blogs = response.body

    assert(blogs.length === 3)

    const titles = blogs.map(blog => blog.title)
    assert(titles.includes('Test Blog Post'))
})

test('if likes property is missing, it defaults to 0', async () => {
    const newBlog = {
        title: 'Blog without likes',
        author: 'Test Author',
        url: 'http://example.com/no-likes'
    }

    const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    assert(response.body.likes === 0)
})

test('blog without title is not added', async () => {
    const newBlog = {
        author: 'Test Author',
        url: 'http://example.com/no-title',
        likes: 5
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

    const response = await api.get('/api/blogs')
    assert(response.body.length === 2)
})

test('blog without url is not added', async () => {
    const newBlog = {
        title: 'Blog without URL',
        author: 'Test Author',
        likes: 5
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

    const response = await api.get('/api/blogs')
    assert(response.body.length === 2)
})

after(async () => {
    await mongoose.connection.close()
})