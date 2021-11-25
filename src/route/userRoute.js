require('dotenv').config()

const express = require('express')
const router = express.Router()
const User = require('../model/users')
const varify = require('../auth/authentication')
const controller = require('../controller/usersController')
const resetPassword = require('../controller/passwordReset')

// Register a new user
router.post('/register', controller.register)
//Login user
router.post('/login', controller.login)
//Reset password Link
router.post('/password-reset', resetPassword.resetPasswordLink)
//Reset password
router.post('/password-reset/:userId/:token', resetPassword.resetPassword)
//Get user
router.get('/getData', [varify.auth], controller.getData)
//Edit user
router.patch('/:id', [varify.auth, getUser], controller.updateUser)
//Delete User
router.delete('/:id', [varify.auth, getUser], controller.deleteUser)


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
module.exports = router