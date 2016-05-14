angular.module('runescapeHiscores', ['ngRoute', 'ngAnimate'])
    .filter('safe', function ($sce) { return $sce.trustAsHtml })
    .controller('mainController', [ '$scope',
        function($scope) {
            $scope.skills = [
                {name: "attack"},
                {name: "hitpoints"},
                {name: "mining"},
                {name: "strength"},
                {name: "agility"},
                {name: "smithing"},
                {name: "defence"},
                {name: "herblore"},
                {name: "fishing"},
                {name: "ranged"},
                {name: "thieving"},
                {name: "cooking"},
                {name: "prayer"},
                {name: "crafting"},
                {name: "firemaking"},
                {name: "magic"},
                {name: "fletching"},
                {name: "woodcutting"},
                {name: "runecrafting"},
                {name: "slayer"},
                {name: "farming"},
                {name: "construction"},
                {name: "hunter"}
            ];
        }
    ]);


$(document).ready(function() {
    $("#form").submit(function(event){
        event.preventDefault()

        let form = $(this),
            user = $("#user-name").val()

        $.get('/player/' + user, appendSkills)
            .success(() => form.trigger('reset'))
            .fail((error) => console.log('Not sure what happened exactly, but here\s the error report: ', error))
    })

    function appendSkills(data) {
        let user = $("#user-name").val()

        console.groupCollapsed(user) // To organize our console logs

        data.map( (index) => console.log(JSON.stringify(index)) )

        let skills_list = []
        let total_combt = []

        let skills  = data.filter( (index) => index.skill !== 'overall' )
        let overall = data.filter( (index) => index.skill  == 'overall' )

        skills.map(function(index) {
            let skill      = index.skill,
                rank       = index.rank,
                level      = index.level,
                experience = index.experience

            let skillElement = `<div class="skill skill--${skill}"><img class="skill__image skill_image--${skill}" src="./Assets/images/${skill}.png" alt=""><div class="skill__level">${level}</div></div>`

            skills_list.push(skillElement)
        })

        overall.map(function(index) {
            let level        = index.level,
                totalElement = `overall: ${level}`
            total_combt.push(totalElement)
        })

        $('.skills, .overall-and-combat').empty()
        $('.overall-and-combat').append(total_combt)
        $('.skills').append(skills_list)
        console.groupEnd()
    }
})