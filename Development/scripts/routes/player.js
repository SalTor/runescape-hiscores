const express = require('express');
const router  = express.Router();
const api     = require('runescape-api');

router.get('/:username', function (req, res) {
    let username = req.params.username;

    console.log("The player page has been requested for: " + username);

    api.osrs.hiscores.player(username)
        .then(logInfo)
        .catch(console.error);

    let skills = new Array();

    function logInfo(info) {
        let player     = info.skills,
            activities = info.activities;

        for(let skill in player){
            skills.push(new Skill([skill, player[skill].rank, player[skill].level, player[skill].exp]));
        }
        
        res.send(skills).status(200);
    }

    function Skill([skill, rank, level, experience] = []){
        this.skill      = skill;
        this.rank       = rank;
        this.level      = level;
        this.experience = experience;
    }
});

module.exports = router;