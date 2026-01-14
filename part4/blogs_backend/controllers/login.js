const router = require('express').Router()
const User = require('../models/users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.post('/', async (req, res) => {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({ error: 'username and password required' })
    }

    const { username, password } = req.body

    const user = await User.findOne({ username })
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash)

    if (!(user && passwordCorrect)) {
        return res.status(401).json({
            error: 'invalid username or password'
        })
    }

    const userForToken = {
        username: user.username,
        id: user._id,
    }

    const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60 * 60 })

    res.status(200).send({ token, username: user.username, name: user.name })
})

module.exports = router