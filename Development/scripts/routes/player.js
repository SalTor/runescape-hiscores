const express = require('express')
const router  = express.Router()
const api     = require('runescape-api')
const objectAssign = require('object-assign')

router.get('/:username', function (req, res) {
    let username = req.params.username

    console.log("The player page has been requested for: " + username)

    api.osrs.hiscores.player(username)
        .then(logInfo)
        .catch(console.error)

    let skills = new Array()

    function logInfo(info) {
        let player     = info.skills,
            activities = info.activities

        for(let index in player){
            skills.push(
                Skill(
                    {
                        skill:      index,
                        rank:       player[index].rank,
                        level:      player[index].level,
                        experience: player[index].exp
                    }
                )
            )
        }

        res.send(skills).status(200)
    }

    function Skill(attributes){
        let defaults = {skill: '', rank: '', level: '', experience: ''}

        let attribute = objectAssign({}, defaults, attributes)

        return attribute;
    }
})

module.exports = router