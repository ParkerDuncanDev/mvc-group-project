const { findById } = require('../models/Todo')
const Todo = require('../models/Todo')
const User = require('../models/User')

module.exports = {
    getTodos: async (req,res)=>{
        console.log(req.user)
        try{
            const todoItems = await Todo.find({userId:req.user.id})
            const sharedTodoItems = await Todo.find({ sharedWith: `${req.user.id}` })
            console.log(sharedTodoItems)
            const itemsLeft = await Todo.countDocuments({userId:req.user.id,completed: false})
            const sharedItemsLeft = await Todo.countDocuments({sharedWith:req.user.id,completed: false})
            res.render('todos.ejs', {todos: todoItems,
                                    sharedTodos: sharedTodoItems,
                                    left: itemsLeft,
                                    sharedLeft: sharedItemsLeft,
                                    user: req.user})
        }catch(err){
            console.log(err)
        }
    },

    createTodo: async (req, res)=>{
        try{
            await Todo.create({todo: req.body.todoItem, completed: false, userId: req.user.id, dateCreated:new Date().toLocaleDateString('en-us', { month:"short", day:"numeric"}), dateCompleted: "Not Completed" })
            console.log('Todo has been added!')
            res.redirect('/todos')
        }catch(err){
            console.log(err)
        }
    },
    markComplete: async (req, res)=>{
        try{
            await Todo.findOneAndUpdate({_id:req.body.todoIdFromJSFile},{
                completed: true,
                dateCompleted: new Date().toLocaleDateString('en-us', { month:"short", day:"numeric"})
            })
            console.log('Marked Complete')
            res.json('Marked Complete')
        }catch(err){
            console.log(err)
        }
    },
    markIncomplete: async (req, res)=>{
        try{
            await Todo.findOneAndUpdate({_id:req.body.todoIdFromJSFile},{
                completed: false,
                dateCompleted:"Not Completed"
            })
            console.log('Marked Incomplete')
            res.json('Marked Incomplete')
        }catch(err){
            console.log(err)
        }
    },
    deleteTodo: async (req, res)=>{
        console.log(req.body.todoIdFromJSFile)
        try{
            await Todo.findOneAndDelete({_id:req.body.todoIdFromJSFile})
            console.log('Deleted Todo')
            res.json('Deleted It')
        }catch(err){
            console.log(err)
        }
    },
    shareTodo: async (req,res)=>{
        console.log(req.body.shareWith)
        let todoId = req.body.todoIdFromJSFile
        const shareTarget = await User.findOne({$or: [
            {email: req.body.shareWith},
            {userName: req.body.shareWith}
          ]}, (err, existingUser) => {
            if (err) { return next(err) }
            if (!existingUser) {
                req.flash('errors', { msg: 'No user with that name or Email found.' })
            }else{
                console.log(`shareTarget returns ${existingUser._id}`, `todoId returns ${todoId}`)
                return existingUser._id
            }}
            )
        try{
            
        }catch(err){
                console.log(err)
            }
        try {
            console.log(`sharetarget`, shareTarget)
            await Todo.findByIdAndUpdate(todoId,
                { $push: { sharedWith: shareTarget._id } },
                {new: true})
                console.log( await Todo.findById(todoId))
            res.json('todo shared')
        } catch (error) {
            
        }
        }
    }