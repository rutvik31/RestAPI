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
        priority: req.body.priority,
        userId: auth._id
    })
    try {
        await todo.save()
        res.status(201).send({ status: "success", message: "new todo created" })
    } catch (err) {
        res.status(400).send({ status: "error", message: err.message })
    }
}

//Delete task 
exports.deleteTodo = async function (req, res) {
    try {
        await Todo.findByIdAndDelete(req.params._id)
        res.status(200).json({ status: "success", message: "Task Deleted" })
    } catch {
        res.status(200).json({ status: "error", message: " Error deleting task" })
    }
}

//Get a todo
exports.getTodoList = async function (req, res) {
    const auth = jwt.decode(req.headers.authorization)
    let q = [
        {
            $addFields: {
                "createdAt": {
                    $dateToString: {
                        format: "%Y-%m-%d",
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
    ]

    if ("search" in req.query) {
        let sc = {
            $match: {
                $or: [{
                    title: new RegExp(req.query.search.trim(), "ig")
                },
                {
                    text: new RegExp(req.query.search.trim(), "ig")
                },
                {
                    priority: new RegExp(req.query.search.trim(), "ig")
                }]
            }
        }
        q.unshift(sc)
    }

    if ("sort" in req.query) {
        const sortf = {
            $sort: {
                title: parseInt(req.query.sort)
            }
        }
        q.push(sortf)
    }

    if ("page" in req.query && "size" in req.query) {
        const pageF = {
            $facet: {
                meta: [
                    { $count: "title" }
                ],
                data: [
                    { $skip: (parseInt(req.query.page) - 1) * parseInt(req.query.size) },
                    { $limit: parseInt(req.query.size) }
                ]
            }
        }
        q.push(pageF)
    }
    try {
        const todo = await Todo.aggregate(q)
        return res.status(200).send({ status: "success", data: todo[0] })
    } catch (error) {
        return res.status(500).send({ status: "error", error: error })
    }
}

//Check a todo is completed or not 
exports.toggleTodo = async function (req, res) {

    try {
        const todo = await Todo.findByIdAndUpdate(req.body._id, { isCompleted: !req.body.isCompleted })
        return res.status(200).send({ status: "success", data: todo })
    } catch (err) {
        return res.status(400).send({ status: "error", message: "Error updating task" })

    }

}
