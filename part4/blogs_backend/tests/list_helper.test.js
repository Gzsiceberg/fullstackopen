const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
})

describe('total likes', () => {
    const listWithOneBlog = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17f9',
            title: 'Go To Statement Considered Harmful 2',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 7,
            __v: 0
        }
    ]

    test('when list has only one blog, equals the likes of that', () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        assert.strictEqual(result, 12)
    })
})

describe('favorite blog', () => {
    const blogs = [
        {
            _id: '5a422a851b54a676234d17f7',
            title: 'React patterns',
            author: 'Michael Chan',
            url: 'https://reactpatterns.com/',
            likes: 7,
        },
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 5,
        },
        {
            _id: '5a422b3a1b54a676234d17f9',
            title: 'Canonical string reduction',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
            likes: 12,
        }
    ]

    test('returns the blog with most likes', () => {
        const result = listHelper.favoriteBlog(blogs)
        const trueResult = {
            title: 'Canonical string reduction',
            author: 'Edsger W. Dijkstra',
            likes: 12
        }
        assert.deepStrictEqual(result.title, trueResult.title)
        assert.deepStrictEqual(result.author, trueResult.author)
        assert.deepStrictEqual(result.likes, trueResult.likes)
    })

    test('returns null when list is empty', () => {
        const result = listHelper.favoriteBlog([])
        assert.strictEqual(result, null)
    })

    test('returns the only blog when list has one blog', () => {
        const oneBlog = [blogs[0]]
        const result = listHelper.favoriteBlog(oneBlog)
        const trueResult = {
            title: 'React patterns',
            author: 'Michael Chan',
            likes: 7
        }
        assert.deepStrictEqual(result.title, trueResult.title)
        assert.deepStrictEqual(result.author, trueResult.author)
        assert.deepStrictEqual(result.likes, trueResult.likes)
    })
})