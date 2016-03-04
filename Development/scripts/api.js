'use strict';

const express = require('express');
const app     = express();
const path    = require('path');
const player  = require('./routes/player');

app.use('/', express.static(path.join(__dirname, '../')));
app.use('/player', player);

app.get('/', function(req, res){
    console.log("The homepage has been requested");
    res.sendFile('index.html');
});

app.listen(3000, function(){
    console.log("Server is now listening on port 3000, visit localhost:3000");
});