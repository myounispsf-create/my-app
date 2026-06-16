const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('./User')

const SECRET = 'mysecretkey123'

// Middleware - check if user is logged in
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.status(401).json({ message: 'No token!' })
  }
  try {
    const decoded = jwt.verify(token, SECRET)
    req.userId = decoded.id
    next()
  } catch (err) {
    res.status(401).json({ message: 'Invalid token!' })
  }
}

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const existingUser = await User.findOne({ username: req.body.username })
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists!' })
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const user = new User({
      username: req.body.username,
      password: hashedPassword
    })
    await user.save()
    res.json({ message: 'User registered successfully! ✅' })
  } catch (err) {
    res.status(500).json({ message: 'Error registering user' })
  }
})

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username })
    if (!user) {
      return res.status(400).json({ message: 'User not found!' })
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Wrong password!' })
    }
    const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: '1d' })
    res.json({ token, username: user.username })
  } catch (err) {
    res.status(500).json({ message: 'Error logging in' })
  }
})

module.exports = { router, authMiddleware }