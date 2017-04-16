'use strict';

let add_details = require("./add_details.js")

module.exports = function (args) {
    try {
        let calc_cb = require("./calc_combat_level.js"),
            _ = require("lodash")

        let combatFilter = /(attack|strength|defence|hitpoints|magic|ranged|prayer)/i,
            skill_stats = _.values(args.skills),
            skill_names = _.keys(args.skills)

        let stats = skill_stats.map((stat, stat_index) => {
            return _.assign({ id: stat_index, skill: skill_names[stat_index], exp: stat.exp }, stat)
        })

        let overall = _.find(stats, { skill: "overall" })

        overall.combat_level = calc_cb(_.filter(stats, index => index.skill.match(combatFilter)))

        return add_details(stats)
    } catch(error) {
        console.log(error)
    }
}
