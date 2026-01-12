const router = require('express').Router()
const Blogs = require('../models/blogs')

router.get('/', async (request, response) => {
    const blog = await Blogs.find({})
    response.json(blog)
})

// router.get('/:id', (request, response, next) => {
//     const id = request.params.id
//     Blogs.findById(id)
//         .then(blog => {
//             if (blog) {
//                 response.json(blog)
//             } else {
//                 response.status(404).end()
//             }
//         })
//         .catch(error => next(error))
// })

// router.delete('/:id', (request, response, next) => {
//     const id = request.params.id
//     Blogs.findByIdAndDelete(id)
//         .then(() => {
//             response.status(204).end()
//         })
//         .catch(error => {
//             next(error)
//         })
// })

// router.put('/:id', (request, response, next) => {
//     const id = request.params.id
//     const body = request.body

//     Blogs.findById(id).then(personInDb => {
//         if (!personInDb) {
//             return response.status(404).end()
//         }

//         personInDb.number = body.number
//         personInDb.name = body.name
//         return personInDb.save().then(updatedPerson => response.json(updatedPerson))
//     }
//     ).catch(error => next(error))
// })

router.post('/', async (request, response) => {
    const body = request.body

    if (!body) {
        return response.status(400).json({
            error: 'request body missing'
        })
    }

    const person = new Blogs(request.body)
    const result = await person.save()
    response.status(201).json(result)
})

module.exports = router
