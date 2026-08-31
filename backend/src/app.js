const express = require('express')
const cookieParser = require('cookie-parser')
const authRoutes = require('./routes/auth.routes')
const postRoutes = require('./routes/post.routes')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

const allowedOrigin = [
    "http://localhost:3001",
    "https://frontend-alpha-five-y0ngtsf2rz.vercel.app"
]

app.use(cors({
    origin: allowedOrigin,
    credentials: true
}))

app.use('/api/auth', authRoutes)
app.use('/api/post', postRoutes)

module.exports = app
