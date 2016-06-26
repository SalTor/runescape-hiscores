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

    let skills = []
    function logInfo(info) {
        let player = info.skills
        for(let index in player){
            skills.push(
                objectAssign(
                    {},
                    {skill: '', rank: '', level: '', experience: ''},
                    {
                        skill: index,
                        rank: player[index].rank,
                        level: player[index].level,
                        experience: player[index].exp,
                        id: createUniqueId()
                    }
                )
            )
        }

        markHighestSkill(skills)
        markClosestToLeveling(skills)

        res.send(skills).status(200)
    }

    function markHighestSkill(allStats) {
        let highestSkillsFound = [],
            highestSkillExperienceFound = [],
            highestLevelFound = 1,
            highestExperienceFound = 0,
            highestExperienceFoundId,
            highestSkillFound,
            highestSkillBasedOnExperienceAndRank

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

        highestSkillBasedOnExperienceAndRank = highestSkillExperienceFound.find((index) => index.rank == Math.min.apply(Math, highestSkillExperienceFound.map((index) => index.rank)))

        highestSkillBasedOnExperienceAndRank.highestSkill = true
    }
    function markClosestToLeveling(allStats) {
        let levels = [
                {level: 1, experience: 0},
                {level: 2, experience: 83},
                {level: 3, experience: 174},
                {level: 4, experience: 276},
                {level: 5, experience: 388},
                {level: 6, experience: 512},
                {level: 7, experience: 650},
                {level: 8, experience: 801},
                {level: 9, experience: 969},
                {level: 10, experience: 1154},
                {level: 11, experience: 1358},
                {level: 12, experience: 1584},
                {level: 13, experience: 1833},
                {level: 14, experience: 2107},
                {level: 15, experience: 2411},
                {level: 16, experience: 2746},
                {level: 17, experience: 3115},
                {level: 18, experience: 3523},
                {level: 19, experience: 3973},
                {level: 20, experience: 4470},
                {level: 21, experience: 5018},
                {level: 22, experience: 5624},
                {level: 23, experience: 6291},
                {level: 24, experience: 7028},
                {level: 25, experience: 7842},
                {level: 26, experience: 8740},
                {level: 27, experience: 9730},
                {level: 28, experience: 10824},
                {level: 29, experience: 12031},
                {level: 30, experience: 13363},
                {level: 31, experience: 14833},
                {level: 32, experience: 16456},
                {level: 33, experience: 18247},
                {level: 34, experience: 20224},
                {level: 35, experience: 22406},
                {level: 36, experience: 24815},
                {level: 37, experience: 27473},
                {level: 38, experience: 30408},
                {level: 39, experience: 33648},
                {level: 40, experience: 37224},
                {level: 41, experience: 41171},
                {level: 42, experience: 45529},
                {level: 43, experience: 50339},
                {level: 44, experience: 55649},
                {level: 45, experience: 61512},
                {level: 46, experience: 67983},
                {level: 47, experience: 75127},
                {level: 48, experience: 83014},
                {level: 49, experience: 91721},
                {level: 50, experience: 101333},
                {level: 51, experience: 111945},
                {level: 52, experience: 123660},
                {level: 53, experience: 136594},
                {level: 54, experience: 150872},
                {level: 55, experience: 166636},
                {level: 56, experience: 184040},
                {level: 57, experience: 203254},
                {level: 58, experience: 224466},
                {level: 59, experience: 247886},
                {level: 60, experience: 273742},
                {level: 61, experience: 302288},
                {level: 62, experience: 333804},
                {level: 63, experience: 368599},
                {level: 64, experience: 407015},
                {level: 65, experience: 449428},
                {level: 66, experience: 496254},
                {level: 67, experience: 547953},
                {level: 68, experience: 605032},
                {level: 69, experience: 668051},
                {level: 70, experience: 737627},
                {level: 71, experience: 814445},
                {level: 72, experience: 899257},
                {level: 73, experience: 992895},
                {level: 74, experience: 1096278},
                {level: 75, experience: 1210421},
                {level: 76, experience: 1336443},
                {level: 77, experience: 1475581},
                {level: 78, experience: 1629200},
                {level: 79, experience: 1798808},
                {level: 80, experience: 1986068},
                {level: 81, experience: 2192818},
                {level: 82, experience: 2421087},
                {level: 83, experience: 2673114},
                {level: 84, experience: 2951373},
                {level: 85, experience: 3258594},
                {level: 86, experience: 3597792},
                {level: 87, experience: 3972294},
                {level: 88, experience: 4385776},
                {level: 89, experience: 4842295},
                {level: 90, experience: 5346332},
                {level: 91, experience: 5902831},
                {level: 92, experience: 6517253},
                {level: 93, experience: 7195629},
                {level: 94, experience: 7944614},
                {level: 95, experience: 8771558},
                {level: 96, experience: 9684577},
                {level: 97, experience: 10692629},
                {level: 98, experience: 11805606},
                {level: 99, experience: 13034431},
                {level: 100, experience: 14391160},
                {level: 101, experience: 15889109},
                {level: 102, experience: 17542976},
                {level: 103, experience: 19368992},
                {level: 104, experience: 21385073},
                {level: 105, experience: 23611006},
                {level: 106, experience: 26068632},
                {level: 107, experience: 28782069},
                {level: 108, experience: 31777943},
                {level: 109, experience: 35085654},
                {level: 110, experience: 38737661},
                {level: 111, experience: 42769801},
                {level: 112, experience: 47221641},
                {level: 113, experience: 52136869},
                {level: 114, experience: 57563718},
                {level: 115, experience: 63555443},
                {level: 116, experience: 70170840},
                {level: 117, experience: 77474828},
                {level: 118, experience: 85539082},
                {level: 119, experience: 94442737},
                {level: 120, experience: 104273167},
                {level: 121, experience: 115126838},
                {level: 122, experience: 127110260},
                {level: 123, experience: 140341028},
                {level: 124, experience: 154948977},
                {level: 125, experience: 171077457},
                {level: 126, experience: 188884740},
                {level: 127, experience: 200000000}
            ],
            closestToLeveling = [],
            closestNonCombatToLeveling,
            experienceDifferenceForLevel,
            experienceUntilNextLevel,
            percentProgressToNextLevel,
            currentSkill,
            currentVirtualLevel,
            currentExperience,
            currentLevel,
            currentExperienceBracket,
            currentBracket,
            nextBracket,
            nextLevel,
            nextExperience,
            indexOfNextBracket,
            ifThereIsNoNextBracket

        allStats = allStats.filter((index) => index.skill !== 'overall')

        allStats.map(function (currentStat) {
            currentSkill = currentStat.skill
            currentExperience = currentStat.experience
            currentLevel = currentStat.level

            nextBracket = levels.find((index) => index.experience > currentExperience)
            ifThereIsNoNextBracket = (nextBracket === undefined)
            nextBracket = ifThereIsNoNextBracket ? {level: 127, experience: 200000000} : nextBracket

            indexOfNextBracket = levels.indexOf(nextBracket)

            nextLevel = nextBracket.level
            currentBracket = ifThereIsNoNextBracket ? {level: 127, experience: 200000000} : levels[indexOfNextBracket - 1]
            currentVirtualLevel = currentBracket.level

            nextExperience = nextBracket.experience

            experienceUntilNextLevel = nextExperience - currentExperience

            experienceDifferenceForLevel = nextExperience - currentBracket.experience
            percentProgressToNextLevel = (experienceUntilNextLevel == 0) ? 100 : roundNumber(((experienceDifferenceForLevel - experienceUntilNextLevel) / experienceDifferenceForLevel) * 100, 1)

            currentStat.experienceUntilNextLevel = experienceUntilNextLevel
            currentStat.virtualLevel = currentVirtualLevel
            currentStat.progressToNextLevel = percentProgressToNextLevel

            // console.log(`${currentSkill} level: ${currentVirtualLevel}`)
            // console.log(`\tCurrent bracket: ${JSON.stringify(currentBracket)}`)
            // console.log(`\tNext bracket: ${JSON.stringify(nextBracket)}`)
            // console.log(`\tNext level at: ${nextExperience}`)
            // console.log(`\tFrom start to finish there is ${experienceDifferenceForLevel}xp between ${currentVirtualLevel} and ${nextLevel}`)
            // console.log(`\t${experienceUntilNextLevel}xp to go!`)
            // console.log(`\t${percentProgressToNextLevel}% of the way to ${nextLevel}!\n`)

            closestToLeveling.push(currentStat)
        })

        closestNonCombatToLeveling = closestToLeveling.find((index) => index.experienceUntilNextLevel == Math.min.apply(Math, closestToLeveling.filter((index) => !index.skill.match(/(attack|strength|defence|hitpoints|magic|ranged|prayer)/i) && index.experienceUntilNextLevel !== 0).map((index) => index.experienceUntilNextLevel)))

        closestNonCombatToLeveling.closestNonCombatToLeveling = true
        
        closestToLeveling = closestToLeveling.find((index) => index.experienceUntilNextLevel == Math.min.apply(Math, closestToLeveling.filter((index) => index.experienceUntilNextLevel !== 0).map((index) => index.experienceUntilNextLevel)))
        
        closestToLeveling.closestToNextLevel = true
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

    function roundNumber(number, places) {
        let multiplier = Math.pow(10, places);
        return (number == 100) ? 100 : Math.round(number * multiplier) / multiplier
    }
})

module.exports = router