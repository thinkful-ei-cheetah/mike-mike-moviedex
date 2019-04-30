const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')

const app = express()

app.use(morgan('common'))

app.use((req, res) => {
  res.send('Hello, world!')
})

app.listen(3000, () => {
  console.log('running!')
})