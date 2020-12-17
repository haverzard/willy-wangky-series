require('dotenv').config()
require("./db.js")

const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')
var materialsRouter = require('./routes/materials')

var app = express()

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/materials', materialsRouter)

module.exports = app
