require('dotenv').config()
const express = require('express')
const app = express()

const dbc = require('./database')
const checkLoginCredentials = require('./services/checkLoginCredentials')

const PORT = process.env.PORT || 8080

app.use(express.json())

// Login API
app.post('/login', (request, response) => {
    checkLoginCredentials(request, response)
})

app.get('/logout', async (req, res) => {
    res.send("Log Out")
})


app.listen(PORT, () => console.log("Server started on port ", PORT))

