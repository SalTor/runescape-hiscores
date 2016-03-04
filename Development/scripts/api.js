'use strict';

const express = require('express');
const app     = express();
const api     = require('runescape-api');
const path    = require('path');

app.use('/', express.static(path.join(__dirname, '../')));

app.get('/', function(req, res){
    console.log("The homepage has been requested");
    res.sendFile('index.html');
});

app.get('/player/:username', function (req, res) {
    let username = req.params.username;

    console.log("The player page has been requested for: " + username);

    api.osrs.hiscores.player(username)
        .catch(console.error)
        .then(logInfo);

    let skills = new Array();

    function logInfo(info) {
        let player     = info.skills,
            activities = info.activities;

        for(let skill in player){
            skills.push(new Skill([skill, player[skill].rank, player[skill].level, player[skill].exp]));
        }
        
        res.send(skills);
    }

    function Skill([skill, rank, level, experience] = []){
        this.skill      = skill;
        this.rank       = rank;
        this.level      = level;
        this.experience = experience;
    }
});

app.listen(3000, function(){
    console.log("Server is now listening on port 3000, visit localhost:3000");
});