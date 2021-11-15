//instantiate express module
require('dotenv').config();
const express = require("express")

const cors = require('cors')

const router = require('./src/routes')

//use express in app variable
const app = express()

//define the server port
const port = 5000;

//create the homepage route
app.use(express.json())

app.use(cors())

app.use('/api/v1/', router)
app.use('/uploads', express.static('uploads'));


//when this nodejs app executed, it will listen to defined port
app.listen(port, () => console.log(`Listening on port ${port}!`))