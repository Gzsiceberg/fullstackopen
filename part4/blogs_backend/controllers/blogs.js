const router = require('express').Router()
const Blogs = require('../models/blogs')

router.get('/', async (request, response) => {
    const blog = await Blogs.find({})
    response.json(blog)
})

router.delete('/:id', async (request, response) => {
    await Blogs.findByIdAndDelete(request.params.id)
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

    if (!body.title || !body.url) {
        return response.status(400).json({
            error: 'title or url missing'
        })
    }

    const person = new Blogs(request.body)
    const result = await person.save()
    response.status(201).json(result)
})

module.exports = router
