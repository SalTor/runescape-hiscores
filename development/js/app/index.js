
angular.module('runescapeHiscores', ['ngRoute', 'ngAnimate'])
    .filter('safe', function ($sce) { return $sce.trustAsHtml })
    .filter('capitalize', function () {
        return function(input) {
            return (!!input) ? _.toUpper(input.charAt(0)) + _.toLower(input.substr(1)) : '';
        }
    })
    .controller('mainController', [ '$scope', 'numberFilter',
        function($scope, numberFilter) {
            let skillName = ["attack", "hitpoints", "mining", "strength", "agility", "smithing", "defence", "herblore", "fishing", "ranged", "thieving", "cooking", "prayer", "crafting", "firemaking", "magic", "fletching", "woodcutting", "runecrafting", "slayer", "farming", "construction", "hunter"]

            $scope.skills = _.map(skillName, (index) => _.assign({}, {skill: index, level: 1, experience: 0, progressToNextLevel: 0, virtualLevel: 1, experienceUntilNextLevel: 83, rank: -1}))

            _.assign(_.find($scope.skills, {skill: "hitpoints"}), {level: 10, virtualLevel: 10, experience: 1154})

            $scope.overall_total_level = _.sum(_.map($scope.skills, 'level'))
            $scope.overall_experience  = _.sum(_.map($scope.skills, 'experience'))
            $scope.player = 'username'
            $scope.username = 'username'

            $scope.overall = {}
            $scope.overall.skill = 'overall'
            $scope.overall.level = $scope.overall_total_level
            $scope.overall.experiernce = $scope.overall_experience
            $scope.overall.rank = -1

            $scope.form_empty = true

            $scope.skillFocusedName = 'sailing'
            $scope.skillFocusedLevel = 0
            $scope.skillFocusedExperience = undefined
            $scope.skillFocusedVirtualLevel = 1
            $scope.skillFocusedIsRanked = false
            $scope.skillFocusedRank = -1
            $scope.skillFocusedProgressToNextLevel = 0
            $scope.skillFocusedNextLevel = 2
            $scope.skillFocusedIsMaxed = false
            $scope.skillFocusedExperienceUntilNextLevel = undefined
            $scope.overall__combat_level = 3

            $("#player__form").submit(function(event) {
                console.log("Form submitted")
                event.preventDefault()

                let that = this,
                    form = $(that),
                    user = $("#player__input").val(),
                    timeout = 1250

                $.ajax({
                    timeout: timeout,
                    url: 'http://projects.saltor.nyc:3030/player/' + user,
                    success: function (data) {
                        appendSkills(data)
                    },
                    error: function (error) {
                        console.log(`Sorry, no user with the name ${user} was found`)
                        console.log(`Not sure what happened exactly, but here's the error report: `, JSON.stringify(error, null, 4))
                    },
                    complete: function () {
                        $scope.username = user

                        form.trigger('reset')
                    }
                })
            })

            function appendSkills(stats) {
                let user = $("#player__input").val()

                console.groupCollapsed(user) // To organize our console logs

                stats.map( (index) => console.log(JSON.stringify(index, null, 4)) )

                let total_combt = []

                let skills  = _.reject(stats, {skill: 'overall'})
                let overall = _.filter(stats, {skill: 'overall'})

                $scope.skills = skills
                $scope.bestSkill = _.find(skills, 'highestSkill')

                $scope.overall = overall[0]
                $scope.overall_total_level = $scope.overall.level
                $scope.overall_experience  = $scope.overall.experience
                $scope.overall_rank        = $scope.overall.rank

                $scope.player = user
                $scope.form_empty = false

                $scope.overall__combat_level = overall[0].combat_level

                $scope.updateSkillHovered($scope.bestSkill)

                $scope.$digest()

                console.groupEnd()
            }

            $scope.updateSkillHovered = function (stat) {
                if (stat.skill !== 'overall') {
                    $scope.overall_hovered = false

                    $scope.skillFocusedName = stat.skill
                    $scope.skillFocusedLevel = stat.level
                    $scope.skillFocusedExperience = (stat.experience == -1) ? undefined : stat.experience
                    $scope.skillFocusedVirtualLevel = stat.virtualLevel
                    $scope.skillFocusedIsRanked = stat.rank != -1
                    $scope.skillFocusedRank = stat.rank
                    $scope.skillFocusedProgressToNextLevel = stat.progressToNextLevel
                    $scope.skillFocusedNextLevel = (stat.virtualLevel == 127) ? 127 : stat.virtualLevel + 1
                    $scope.skillFocusedIsMaxed = stat.experienceUntilNextLevel == 0
                    $scope.skillFocusedExperienceUntilNextLevel = $scope.skillFocusedIsMaxed ? `This skill has been maxed!` : (stat.experience == -1) ? undefined : stat.experienceUntilNextLevel
                } else {
                    $scope.overall_hovered = true

                    $scope.skillFocusedName = 'Overall'
                    $scope.skillFocusedLevel = stat.level
                    $scope.skillFocusedExperience = ($scope.username == 'username') ? $scope.overall_experience : stat.experience
                    $scope.skillFocusedRank = stat.rank
                }
            }

            $scope.colorCodeProgress = function (percent) {
                percent = $scope.roundDown(percent)
                if(percent < 25) {
                    return 'progress-bar-danger'
                } else if(percent >= 25 && percent < 50) {
                    return 'progress-bar-info'
                } else if(percent >= 50 && percent < 75) {
                    return 'progress-bar-warning'
                } else if(percent >= 75) {
                    return 'progress-bar-success'
                }
            }

            $scope.roundDown = function (valueToFloor) {
                return _.floor(valueToFloor)
            }
        }
    ]);
