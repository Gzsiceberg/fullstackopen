const router = require('express').Router()
const Blogs = require('../models/blogs')
const Users = require('../models/users')

router.get('/', async (request, response) => {
    const blog = await Blogs.find({}).populate('user', { username: 1, name: 1 })
    response.json(blog)
})

const checkRequest = (request, response) => {
    if (!request.token) {
        response.status(401).json({ error: 'token missing or invalid' })
        return false
    }

    if (!request.user) {
        response.status(401).json({ error: 'token is invalid' })
        return false
    }

    return true
}

router.delete('/:id', async (request, response) => {
    if (!checkRequest(request, response)) {
        return
    }

    const blog = await Blogs.findById(request.params.id)
    if (!blog) {
        return response.status(404).end()
    }

    if (blog.user.toString() !== request.user.toString()) {
        return response.status(401).json({ error: 'only the creator can delete a blog' })
    }

    await Blogs.deleteOne({ _id: request.params.id })
    response.status(204).end()
})

router.put('/:id', async (request, response) => {
    if (!checkRequest(request, response)) {
        return
    }

    const body = request.body
    if (!body) {
        return response.status(400).json({
            error: 'request body missing'
        })
    }

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
    await updatedBlog.populate('user', { username: 1, name: 1 })
    response.json(updatedBlog)
})

router.post('/:id/comments', async (request, response) => {
    const { comment } = request.body

    if (!comment || comment.trim().length === 0) {
        return response.status(400).json({ error: 'comment is required' })
    }

    const blog = await Blogs.findById(request.params.id)
    if (!blog) {
        return response.status(404).json({ error: 'blog not found' })
    }

    blog.comments = blog.comments.concat(comment.trim())
    const savedBlog = await blog.save()
    await savedBlog.populate('user', { username: 1, name: 1 })

    response.status(201).json(savedBlog)
})

router.post('/', async (request, response) => {
    if (!checkRequest(request, response)) {
        return
    }

    const body = request.body
    if (!body) {
        return response.status(400).json({
            error: 'request body missing'
        })
    }


    const user = await Users.findById(request.user)
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
    await saveBlog.populate('user', { username: 1, name: 1 })

    user.blogs = user.blogs.concat(saveBlog._id)
    await user.save()

    response.status(201).json(saveBlog)
})

module.exports = router
