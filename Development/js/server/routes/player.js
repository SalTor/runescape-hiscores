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

    function logInfo(info) {
        let player     = info.skills,
            activities = info.activities

        for(let index in player){
            skills.push(
                objectAssign(
                    {},
                    {skill: '', rank: '', level: '', experience: ''},
                    {
                        skill: index,
                        rank: player[index].rank,
                        level: player[index].level,
                        experience: player[index].exp, id: createUniqueId()
                    }
                )
            )
        }

        markHighestSkill(skills)

        res.send(skills).status(200)
    }

    let skills = [],
        highestSkillsFound = [],
        highestSkillExperienceFound = [],
        highestLevelFound = 1,
        highestExperienceFound = 0,
        highestExperienceFoundId,
        highestSkillFound

    function markHighestSkill(allStats) {
        allStats = allStats.filter((index) => index.skill !== 'overall')

        allStats.map(function (currentSkill) {
            if(currentSkill.level > highestLevelFound){
                highestLevelFound = currentSkill.level

                if(highestSkillsFound.length > 0) {
                    highestSkillsFound.pop()
                    highestSkillsFound.push(currentSkill)
                    highestSkillFound = currentSkill.id
                } else {
                    highestSkillsFound.push(currentSkill)
                    highestSkillFound = currentSkill.id
                }
            } else if(currentSkill.level == 99) {
                highestSkillsFound.push(currentSkill)
                highestSkillFound = currentSkill.id
            }
        })

        highestSkillsFound.map(function (currentSkill) {
            if(currentSkill.experience > highestExperienceFound){
                highestExperienceFound = currentSkill.experience

                if(highestSkillExperienceFound.length > 0) {
                    highestSkillExperienceFound.pop()
                    highestSkillExperienceFound.push(currentSkill)
                    highestExperienceFoundId = currentSkill.id
                } else {
                    highestSkillExperienceFound.push(currentSkill)
                    highestExperienceFoundId = currentSkill.id
                }
            } else if(currentSkill.experience == 200000000) {
                highestSkillExperienceFound.push(currentSkill)
                highestExperienceFoundId = currentSkill.id
            }
        })

        let highestSkillBasedOnExperienceAndRank = highestSkillExperienceFound.find((index) => index.rank == Math.min.apply(Math, highestSkillExperienceFound.map((index) => index.rank)))

        highestSkillBasedOnExperienceAndRank.highestSkill = true
    }
    
    function createUniqueId() {
        return generateRandomHash() + generateRandomHash()
            + '-' + generateRandomHash() + '-' + generateRandomHash()
            + '-' + generateRandomHash() + '-' + generateRandomHash()
            + generateRandomHash() + generateRandomHash()
    }
    function generateRandomHash() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
})

module.exports = router