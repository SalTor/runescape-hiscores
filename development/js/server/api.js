'use strict';

const express = require('express')
const app     = express()
const path    = require("path")
const player  = require("./routes/player")
const cors    = require("cors")

app.use(cors());
app.use('/', express.static(path.join(__dirname, "../../")))
app.use('/player', player)

app.get('/', function(req, res){
    console.log("\nThe homepage has been requested")
    res.sendStatus(200)
})

app.listen(3030, function(){
    console.log("\nServer is now listening on port 3030, visit localhost:3030")
})
