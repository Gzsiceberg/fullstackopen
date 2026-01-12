const router = require('express').Router()
const Blogs = require('../models/blogs')

router.get('/', (request, response, next) => {
    Blogs.find({}).then((blogs) => {
        response.json(blogs)
    }).catch(error => next(error))
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

router.post('/', (request, response, next) => {
    const body = request.body

    if (!body) {
        return response.status(400).json({
            error: 'request body missing'
        })
    }

    const person = new Blogs(request.body)
    person.save().then(result => {
        response.status(201).json(result)
    }).catch(error => next(error))
})

module.exports = router
