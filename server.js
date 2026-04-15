const express = require('express')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 8080

// Serve built static files
app.use(express.static(path.join(__dirname, 'dist')))

// SPA fallback — all routes return index.html so React Router works
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
