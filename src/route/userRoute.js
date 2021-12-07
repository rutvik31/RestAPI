require('dotenv').config()

const express = require('express')
const router = express.Router()
const User = require('../model/users')
const Todo = require('../model/todo')
const varify = require('../auth/authentication')
const userCntroller = require('../controller/usersController')
const todoController = require('../controller/todoController')
const resetPassword = require('../controller/passwordReset')
const { findById } = require('../model/todo')

//User Routes
// Register a new user
router.post('/register', userCntroller.register)
//Login user
router.post('/login', userCntroller.login)
//Reset password Link
router.post('/password-reset', resetPassword.resetPasswordLink)
//Reset password
router.post('/password-reset/:userId/:token', resetPassword.resetPassword)
//Get user
router.get('/getData', [varify.auth], userCntroller.getData)
//Edit user
router.patch('/:id', [varify.auth, getUser], userCntroller.updateUser)
//Delete User
router.delete('/:id', [varify.auth, getUser], userCntroller.deleteUser)

//Todo Routes
router.post('/addtodo', [varify.auth], todoController.addTodo)
//List  Todo
router.get('/gettodo', [varify.auth], todoController.getTodoList)
//Toggle Todo
router.post('/toggletodo', todoController.toggleTodo)

// User Route Middleware
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

// // Todo Route Middelware
// async function getTodo(req, res, next) {
//     let todo
//     try {
//         todo = await Todo.findById(req.params.id)
//         if (todo == null) {
//             return res.status(404).send({ status: "fail", message: "Cannot find todo task" })
//         }
//     } catch (err) {
//         return res.status(500).json({ message: err.message })
//     }

//     res.todo = todo
//     next()
// }

module.exports = router