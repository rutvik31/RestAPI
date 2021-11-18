require('dotenv').config()

const express = require('express')
const router = express.Router()
const User = require('../model/users')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

//Create a new user
router.post('/signup', async (req, res) => {

    //Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    })
    try {
        let newUser = await user.save()

        const token = jwt.sign({ name: newUser.name }, process.env.TOKEN_SECERT)

        res.status(201).json({ user: newUser, token: token })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

//Get all users
router.get('/', [auth], async (req, res) => {
    try {
        const users = await User.find()
        res.json(users)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//Ger single user
router.get('/:id', [auth, getUser], (req, res) => {
    res.json(res.user)
})

//Update user
router.patch('/:id', getUser, async (req, res) => {
    if (req.body.name !== null) {
        res.user.name = req.body.name
    }
    if (req.body.email !== null) {
        res.user.email = req.body.email
    }
    try {
        let updateUser = await res.user.save()
        res.json(updateUser)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

//Delete user
router.delete('/:id', getUser, async (req, res) => {
    try {
        await res.user.remove()
        res.json({ message: "User deleted" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Route Middleware
async function getUser(req, res, next) {
    let user
    try {
        user = await User.findById(req.params.id)
        if (user == null) {
            return res.status(404).json({ message: 'Cannot find user' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.user = user
    next()
}

//Auth middleware
function auth(req, res, next) {
    const authHeader = req.headers.authorization
    try {
        if (!authHeader) {
            return res.status(402).json({ message: "Forbbiden" })
        }
        jwt.verify(authHeader, process.env.TOKEN_SECERT)
        next()
    } catch (err) {
        return res.status(402).json({ message: err.message })
    }
}



module.exports = router