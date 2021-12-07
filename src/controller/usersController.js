require('dotenv').config()

const User = require('../model/users')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const saltRounds = 10;
const registerValidation = require('../validation/register')
const loginValidation = require('../validation/login')


//Create a new user
exports.register = async function (req, res) {

    //Validate user
    const { error } = registerValidation(req.body);
    if (error) return res.status(401).json(error.details[0].message)

    //Check if user already in database
    const isExist = await User.findOne({ email: req.body.email });
    if (isExist) {
        return res.status(400).send({ status: "error", message: "Email already exists" })
    }
    //Hash Password
    const salt = await bcrypt.genSalt(saltRounds);
    const hashPassword = await bcrypt.hash(req.body.password, salt)

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    })
    try {
        await user.save()
        res.status(201).send({ status: "success", message: "new user created" })
    } catch (err) {
        res.status(400).send({ status: "error", message: err.message })
    }
}

//Login user
exports.login = async function (req, res) {

    //Validate User data
    const { error } = loginValidation(req.body);
    if (error) return res.status(401).json(error.details[0].message)

    //Check user credential 
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(404).send({ status: "error", message: "email do not exist" })
    }
    if (await bcrypt.compare(req.body.password, user.password)) {
        user.password = undefined
        //Generate Token
        const token = jwt.sign(JSON.stringify(user), process.env.TOKEN_SECERT)
        res.send({ status: "success", data: { token: token } })
    } else {
        res.status(401).send({ status: "error", message: "Email or password don't match" })
    }
}

//Get all users
exports.getData = async function (req, res) {
    try {
        res.status(200).send({ status: "success", data: jwt.decode(req.headers.authorization) })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

//Update user
exports.updateUser = async function (req, res) {
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
}

//Delete user
exports.deleteUser = async function (req, res) {
    try {
        await res.user.remove()
        res.json({ message: "User deleted" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}






