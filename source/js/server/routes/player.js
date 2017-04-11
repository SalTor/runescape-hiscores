'use strict'

let format = require("../../helpers/format_response.js")

let api = require('runescape-api'),
    express = require('express'),
    router = express.Router()

router.get('/:username', function (req, res) {
    let username = req.params.username

    console.log(`[ username requested ] ${username}`)

    api.osrs.hiscores.player(username)
        .then(response => res.send({ code: 200, stats: format(response) }).status(200))
        .catch(response => {
            let code = response[`statusCode`],
                message = (code === 404) ? `No account with that username was found.` : `Unexpected error.`

            console.log(`[ user not found ]`)

            res.send({ code, message }).status(200)
        })
})

module.exports = router
