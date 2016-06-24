angular.module('runescapeHiscores', ['ngRoute', 'ngAnimate'])
    .filter('safe', function ($sce) { return $sce.trustAsHtml })
    .controller('mainController', [ '$scope',
        function($scope) {
            $scope.skills = [
                {skill: "attack",       level: 1},
                {skill: "hitpoints",    level: 1},
                {skill: "mining",       level: 1},
                {skill: "strength",     level: 1},
                {skill: "agility",      level: 1},
                {skill: "smithing",     level: 1},
                {skill: "defence",      level: 1},
                {skill: "herblore",     level: 1},
                {skill: "fishing",      level: 1},
                {skill: "ranged",       level: 1},
                {skill: "thieving",     level: 1},
                {skill: "cooking",      level: 1},
                {skill: "prayer",       level: 1},
                {skill: "crafting",     level: 1},
                {skill: "firemaking",   level: 1},
                {skill: "magic",        level: 1},
                {skill: "fletching",    level: 1},
                {skill: "woodcutting",  level: 1},
                {skill: "runecrafting", level: 1},
                {skill: "slayer",       level: 1},
                {skill: "farming",      level: 1},
                {skill: "construction", level: 1},
                {skill: "hunter",       level: 1}
            ]

            $scope.overall = 0
            $scope.overall_rank = 0

            $("#form").submit(function(event){
                event.preventDefault()
                var start = new Date().getTime()
                let that = this,
                    form = $(that),
                    user = $("#user-name").val()

                $.get('/player/' + user, appendSkills)
                    .success(function() {
                        var end = new Date().getTime()
                        var time = end - start
                        console.log('Retrieval time: ' + time)
                        form.trigger('reset')
                    })
                    .fail((error) => console.log('Not sure what happened exactly, but here\s the error report: ', error))
            })

            function appendSkills(stats) {
                let user = $("#user-name").val()

                console.groupCollapsed(user) // To organize our console logs

                stats.map( (index) => console.log(JSON.stringify(index, null, 4)) )

                let total_combt = []

                let skills  = stats.filter( (index) => index.skill !== 'overall' )
                let overall = stats.filter( (index) => index.skill  == 'overall' )

                $scope.skills  = skills;
                $scope.highestSkill = skills.find( (index) => index.highestSkill )

                $scope.overall      = overall[0].level
                $scope.overall_rank = overall[0].rank

                $scope.user = user
                
                $scope.$digest()

                console.groupEnd()
            }
        }
    ]);
