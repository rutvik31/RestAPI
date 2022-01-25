const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema({
    userId: {
        type: String,
        require: true
    },
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        require: true
    },
    priority: {
        type: String,
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    isCompleted: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('todolist', todoSchema)
