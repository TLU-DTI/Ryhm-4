require('dotenv').config()

const express = require('express')

const app = express()

app.use(express.json())

const cors = require('cors')

app.use(
    cors({
        origin: 'https://localhost:5500'
    })
)


const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

app.listen(3000, () =>{
    console.log('Server is online on port 3000');
})
