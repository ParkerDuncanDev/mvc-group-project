const Todo = require('../models/Todo')
const User = require('../models/User')

module.exports = {
    getTodos: async (req,res)=>{
        console.log(req.user)
        try{
            const todoItems = await Todo.find({userId:req.user.id})
            const itemsLeft = await Todo.countDocuments({userId:req.user.id,completed: false})
            res.render('todos.ejs', {todos: todoItems, left: itemsLeft, user: req.user})
        }catch(err){
            console.log(err)
        }
    },
    createTodo: async (req, res)=>{
        try{
            await Todo.create({todo: req.body.todoItem, completed: false, userId: req.user.id})
            console.log('Todo has been added!')
            res.redirect('/todos')
        }catch(err){
            console.log(err)
        }
    },
    markComplete: async (req, res)=>{
        try{
            await Todo.findOneAndUpdate({_id:req.body.todoIdFromJSFile},{
                completed: true
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
                completed: false
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
        try{
            await User.findOne({$or: [
                {email: req.body.shareWith},
                {userName: req.body.shareWith}
              ]}, (err, existingUser) => {
                if (err) { return next(err) }
                if (!existingUser) {
                    req.flash('errors', { msg: 'No user with that name or Email found.' })
                }else{
                    console.log(`existingUser returns ${existingUser}`, `shareWith returns ${req.body.shareWith}`,`idfromJS returns ${req.body.todoIdFromJSFile}`)
                    
                     Todo.findOneAndUpdate(
                        {_id: req.body.todoIdFromJSFile},
                        {$push: {sharedWith: existingUser._id}},
                        {new: true})
                    res.json('todo shared')
                }}
            )}catch(err){
                console.log(err)
            }
        }
    }