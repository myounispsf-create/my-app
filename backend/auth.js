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
    console.log('Register error:', err.message)  // ← add this
    res.status(500).json({ message: err.message })  // ← change this
  }
})