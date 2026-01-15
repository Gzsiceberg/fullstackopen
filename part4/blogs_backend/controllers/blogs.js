const router = require('express').Router()
const Blogs = require('../models/blogs')
const Users = require('../models/users')
const jwt = require('jsonwebtoken')

router.get('/', async (request, response) => {
    const blog = await Blogs.find({}).populate('user', { username: 1, name: 1 })
    response.json(blog)
})

router.delete('/:id', async (request, response) => {
    if (!request.token) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const blog = await Blogs.findById(request.params.id)
    if (!blog) {
        return response.status(404).end()
    }

    if (blog.user.toString() !== decodedToken.id.toString()) {
        return response.status(401).json({ error: 'only the creator can delete a blog' })
    }

    await Blogs.deleteOne({ _id: request.params.id })
    response.status(204).end()
})

router.put('/:id', async (request, response) => {
    const body = request.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    const foundedBlog = await Blogs.findById(request.params.id)
    if (!foundedBlog) {
        return response.status(404).end()
    }
    const updatedBlog = await foundedBlog.set(blog).save()
    response.json(updatedBlog)
})

router.post('/', async (request, response) => {
    const body = request.body

    if (!body) {
        return response.status(400).json({
            error: 'request body missing'
        })
    }

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({
            error: 'token missing or invalid'
        })
    }

    const user = await Users.findById(decodedToken.id)
    if (!user) {
        return response.status(400).json({
            error: 'userId missing or invalid'
        })
    }

    if (!body.title || !body.url) {
        return response.status(400).json({
            error: 'title or url missing'
        })
    }

    const blog = new Blogs(request.body)
    blog.user = user._id
    const saveBlog = await blog.save()

    user.blogs = user.blogs.concat(saveBlog._id)
    await user.save()

    response.status(201).json(saveBlog)
})

module.exports = router
