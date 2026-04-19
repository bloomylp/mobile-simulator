import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 8080

// Serve built static files
app.use(express.static(join(__dirname, 'dist')))

// SPA fallback — all routes return index.html so React Router works
app.use((req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
