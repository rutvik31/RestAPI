require('dotenv').config()

const express = require('express')
const router = express.Router()
const multer = require('multer')
const { v4: uuidv4 } = require('uuid')
let path = require('path')
const varify = require('../auth/authentication')
const userCntroller = require('../controller/usersController')
const todoController = require('../controller/todoController')
const resetPassword = require('../controller/passwordReset')

//Middleware for defining the local storage location
const storage = multer.diskStorage({
    destination: "./public",
    filename: (req, file, cb) => {
        cb(null, uuidv4() + '-' + Date.now() + path.extname(file.originalname));
    }
})

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const upload = multer({ storage, fileFilter })


//User Routes
// Register a new user
router.post('/register', upload.single('photo'), userCntroller.register)
//Login user
router.post('/login', userCntroller.login)
//Edit User Details
router.patch('/update/:_id', [varify.auth], userCntroller.updateUser)
//Reset password Link
router.post('/password-reset', resetPassword.resetPasswordLink)
//Reset password
router.post('/password-reset/:userId/:token', resetPassword.resetPassword)
//Get user
router.get('/getData', [varify.auth], userCntroller.getData)

//Todo Routes
router.post('/todo', [varify.auth], todoController.addTodo)
//List  Todo
router.get('/todo', [varify.auth], todoController.getTodoList)
//Toggle Todo
router.patch('/todo', todoController.toggleTodo)
//Delete Todo
router.delete('/todo/:_id', todoController.deleteTodo)

// User Route Middleware
// async function getUser(req, res, next) {
//     let user
//     try {
//         user = await User.findById(req.params.id)
//         if (user == null) {
//             return res.status(404).json({ message: 'Cannot find user' })
//         }
//     } catch (err) {
//         return res.status(500).json({ message: err.message })
//     }

//     res.user = user
//     next()
// }

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