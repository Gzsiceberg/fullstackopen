const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const Blogs = require('../models/blogs')
const Users = require('../models/users')
const supertest = require('supertest')
const app = require('../app')
const { assert } = require('node:console')
const bcrypt = require('bcrypt')
const api = supertest(app)

let token = null
let userId = null

beforeEach(async () => {
    // Clear all data
    await Blogs.deleteMany({})
    await Users.deleteMany({})

    // Create a test user
    const passwordHash = await bcrypt.hash('testpassword', 10)
    const user = new Users({
        username: 'testuser',
        name: 'Test User',
        passwordHash
    })
    const savedUser = await user.save()
    userId = savedUser._id.toString()

    // Login to get token
    const loginResponse = await api
        .post('/api/login')
        .send({ username: 'testuser', password: 'testpassword' })

    token = loginResponse.body.token

    // Create initial blogs with user reference
    const initialBlogs = [
        {
            title: 'First Blog',
            author: 'Author One',
            url: 'http://example.com/1',
            likes: 10,
            user: userId
        },
        {
            title: 'Second Blog',
            author: 'Author Two',
            url: 'http://example.com/2',
            likes: 20,
            user: userId
        }
    ]
    await Blogs.insertMany(initialBlogs)
})

describe('when there are initially some blogs saved', () => {
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')
        assert(response.body.length === 2)
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
})

describe('addition of a new blog', () => {
    test('a valid blog can be added with valid token', async () => {
        const newBlog = {
            title: 'Test Blog Post',
            author: 'Test Author',
            url: 'http://example.com/test',
            likes: 5
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')
        const blogs = response.body

        assert(blogs.length === 3)

        const titles = blogs.map(blog => blog.title)
        assert(titles.includes('Test Blog Post'))
    })

    test('adding a blog fails with 401 if token is not provided', async () => {
        const newBlog = {
            title: 'Test Blog Post',
            author: 'Test Author',
            url: 'http://example.com/test',
            likes: 5
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)

        const response = await api.get('/api/blogs')
        assert(response.body.length === 2)
    })

    test('if likes property is missing, it defaults to 0', async () => {
        const newBlog = {
            title: 'Blog without likes',
            author: 'Test Author',
            url: 'http://example.com/no-likes'
        }

        const response = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
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
            .set('Authorization', `Bearer ${token}`)
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
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(400)

        const response = await api.get('/api/blogs')
        assert(response.body.length === 2)
    })
})

describe('deletion of a blog', () => {
    test('a blog can be deleted by its creator with valid token', async () => {
        const blogsAtStart = await api.get('/api/blogs')
        const blogToDelete = blogsAtStart.body[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)

        const blogsAtEnd = await api.get('/api/blogs')
        assert(blogsAtEnd.body.length === blogsAtStart.body.length - 1)

        const titles = blogsAtEnd.body.map(blog => blog.title)
        assert(!titles.includes(blogToDelete.title))
    })

    test('deletion fails with 401 if token is not provided', async () => {
        const blogsAtStart = await api.get('/api/blogs')
        const blogToDelete = blogsAtStart.body[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(401)

        const blogsAtEnd = await api.get('/api/blogs')
        assert(blogsAtEnd.body.length === blogsAtStart.body.length)
    })

    test('deletion fails with 401 if user is not the creator', async () => {
        // Create another user
        const passwordHash = await bcrypt.hash('anotherpassword', 10)
        const anotherUser = new Users({
            username: 'anotheruser',
            name: 'Another User',
            passwordHash
        })
        await anotherUser.save()

        // Login as another user
        const loginResponse = await api
            .post('/api/login')
            .send({ username: 'anotheruser', password: 'anotherpassword' })

        const anotherToken = loginResponse.body.token

        // Try to delete a blog created by the first user
        const blogsAtStart = await api.get('/api/blogs')
        const blogToDelete = blogsAtStart.body[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `Bearer ${anotherToken}`)
            .expect(401)

        const blogsAtEnd = await api.get('/api/blogs')
        assert(blogsAtEnd.body.length === blogsAtStart.body.length)
    })
})

describe('updating a blog', () => {
    test('a blog can be updated', async () => {
        const blogsAtStart = await api.get('/api/blogs')
        const blogToUpdate = blogsAtStart.body[0]

        const updatedData = {
            ...blogToUpdate,
            likes: 100
        }

        const response = await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(updatedData)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        assert(response.body.likes === 100)
    })

    test('updating likes increases the number', async () => {
        const blogsAtStart = await api.get('/api/blogs')
        const blogToUpdate = blogsAtStart.body[0]
        const originalLikes = blogToUpdate.likes

        const updatedData = {
            ...blogToUpdate,
            likes: originalLikes + 1
        }

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(updatedData)
            .expect(200)

        const blogsAtEnd = await api.get('/api/blogs')
        const updatedBlog = blogsAtEnd.body.find(blog => blog.id === blogToUpdate.id)
        assert(updatedBlog.likes === originalLikes + 1)
    })
})

after(async () => {
    await mongoose.connection.close()
})