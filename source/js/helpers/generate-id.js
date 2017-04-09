const _ = require("lodash")

module.exports = function () {
    function generateRandomHash() {
        return _.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return generateRandomHash() + generateRandomHash()
        + '-' + generateRandomHash() + '-' + generateRandomHash()
        + '-' + generateRandomHash() + '-' + generateRandomHash()
        + generateRandomHash() + generateRandomHash()
}
