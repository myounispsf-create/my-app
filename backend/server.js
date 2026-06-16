const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const Todo = require('./Todo')
const { router: authRoutes, authMiddleware } = require('./auth')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({
  origin: ['https://my-app-eta-two-73.vercel.app', 'http://localhost:5173']
}))
app.use(express.json())
app.use('/api/auth', authRoutes)

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected!'))
  .catch(err => console.log('❌ MongoDB Error:', err))

// GET - Read only logged in user todos
app.get('/api/todos', authMiddleware, async (req, res) => {
  const todos = await Todo.find({ user: req.userId })
  res.json(todos)
})

// POST - Create todo for logged in user
app.post('/api/todos', authMiddleware, async (req, res) => {
  const todo = new Todo({
    text: req.body.text,
    user: req.userId
  })
  await todo.save()
  res.json(todo)
})

// PUT - Update todo
app.put('/api/todos/:id', authMiddleware, async (req, res) => {
  const todo = await Todo.findById(req.params.id)
  if (req.body.text) {
    todo.text = req.body.text
  } else {
    todo.done = !todo.done
  }
  await todo.save()
  res.json(todo)
})

// DELETE - Delete todo
app.delete('/api/todos/:id', authMiddleware, async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id)
  res.json({ message: 'Deleted!' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})