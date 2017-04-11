module.exports = function (stats) {
    let _ = require("lodash")

    function find(skill) {
        return _.find(stats, stat => stat.skill === skill)
    }

    let attack = find("attack"),
        strength = find("strength"),
        defence = find("defence"),
        hitpoints = find("hitpoints"),
        ranged = find("ranged"),
        magic = find("magic"),
        prayer = find("prayer")

    return (0.25 * (defence.level + hitpoints.level + _.floor(prayer.level / 2)) + _.max([0.325 * (attack.level + strength.level), _.max([0.325 * (_.floor(ranged.level / 2) + ranged.level), 0.325 * (_.floor(magic.level  / 2) + magic.level)])])).toFixed(2)
}
