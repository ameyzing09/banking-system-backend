require('dotenv').config()
const cors = require('cors')
const express = require('express')
const app = express()

const dbc = require('./database')
const checkLoginCredentials = require('./services/checkLoginCredentials')
const createBankAccount = require('./services/createBankAccount')
const getTransactionDetails = require('./services/getTransactionDetails')

const PORT = process.env.PORT || 8080

app.use(express.json())
app.use(cors())

// Login API
app.post('/login', (request, response) => {
    checkLoginCredentials(request, response)
})

// Logout API
app.get('/logout', async (req, res) => {
    res.send("Log Out")
})

// Account Opening API
app.post('/accountOpening', (req, res) => {
    createBankAccount(req, res)
})

//View Transaction API
app.post('/viewTransaction', (req, res) => {
    getTransactionDetails(req, res)
})


app.listen(PORT, () => console.log("Server started on port ", PORT))

