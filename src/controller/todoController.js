require('dotenv').config()

const Todo = require('../model/todo')
const jwt = require('jsonwebtoken')

//Create TodoTask 
exports.addTodo = async function (req, res) {

    const todoExists = await Todo.findOne({ title: req.body.title })
    if (todoExists) {
        return res.status(400).send({ status: "error", message: "Todo already exists" })
    }

    const auth = jwt.decode(req.headers.authorization)


    const todo = new Todo({
        title: req.body.title,
        text: req.body.text,
        userId: auth._id
    })
    try {
        await todo.save()
        res.status(201).send({ status: "success", message: "new todo created" })
    } catch (err) {
        res.status(400).send({ status: "error", message: err.message })
    }
}

//Update Todo task
exports.updateTodo = async function (req, res) {

    if (req.body.title != null) {
        req.Todo.title = req.body.title
    }
    if (req.body.text != null) {
        req.Todo.text = req.body.text
    }
    if (req.body.isCompleted != null) {
        req.Todo.isCompleted = req.body.isCompleted
    }
    try {
        let updateTodo = await res.Todo.save()
        res.json(updateTodo)
    } catch (err) {
        res.status(400).json({ err: err.message })
    }

}

//Get a todo
exports.getTodoList = async function (req, res) {
    const auth = jwt.decode(req.headers.authorization)
    const todo = await Todo.aggregate([
        {
            $addFields: {
                "createdAt": {
                    $dateToString: {
                        format: "%d-%m-%Y",
                        date: "$createdAt"
                    }
                }
            },
        },
        {
            $match: {
                userId: auth._id,
                createdAt: req.query.date
            }
        }
    ])
    return res.status(200).send({ status: "success", data: todo })
}
// 
//Check a todo is completed or not 
exports.toggleTodo = async function (req, res) {

    try {
        const todo = await Todo.updateOne({ _id: req.body._id }, { isCompleted: !req.body.isCompleted })
        return res.status(200).send({ status: "success", data: todo })
    } catch (err) {
        return res.status(400).send({ status: "error", message: "Error updating task" })

    }

}