const { test, after, beforeEach, describe } = require('node:test')
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
})

describe('deletion of a blog', () => {
    test('a blog can be deleted', async () => {
        const blogsAtStart = await api.get('/api/blogs')
        const blogToDelete = blogsAtStart.body[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)

        const blogsAtEnd = await api.get('/api/blogs')
        assert(blogsAtEnd.body.length === blogsAtStart.body.length - 1)

        const titles = blogsAtEnd.body.map(blog => blog.title)
        assert(!titles.includes(blogToDelete.title))
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