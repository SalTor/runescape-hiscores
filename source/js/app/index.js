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

            $scope.skills = _.map(skillName, (index) => _.assign({}, {skill: index, level: 1, rank: -1, exp: 0, level_virtual: 1, exp_til_next_level: 83, level_progress: 0}))

            _.assign(_.find($scope.skills, {skill: "hitpoints"}), { level: 10, level_virtual: 10, exp: 1154 })

            $scope.username_not_found = false

            $scope.overall_total_level = _.sum(_.map($scope.skills, "level"))
            $scope.overall_experience  = _.sum(_.map($scope.skills, "exp"))
            $scope.player = "username"
            $scope.username = "username"

            $scope.overall = {}
            $scope.overall.skill = "overall"
            $scope.overall.level = $scope.overall_total_level
            $scope.overall.experiernce = $scope.overall_experience
            $scope.overall.rank = -1

            $scope.form_empty = true

            $scope.skillFocusedName = "sailing"
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
            $scope.request_loading = false

            $("#player__form").submit(function(event) {
                event.preventDefault()

                let that = this,
                    form = $(that),
                    user = $("#player__input").val()

                console.log(`[ retrieving stats ]`)

                $scope.request_loading = true

                $.ajax({
                    url: `http://rsapi.saltor.nyc:2007/player/${user}`,
                    success(data) {
                        let { code, stats } = data

                        if(code === 200) {
                            appendSkills(stats)

                            $scope.username = user

                            form.trigger('reset')
                        } else if(code === 404) {
                            $scope.username_not_found = true
                            $scope.$digest()

                            setTimeout(function () {
                                $scope.username_not_found = false
                                $scope.$digest()
                            }, 1000)
                        }
                    },
                    error(error) {
                        let { status, responseText } = error
                        console.error(`ERROR (${status}): ${responseText}`)
                    },
                    complete() {
                        setTimeout(function () {
                            $scope.request_loading = false
                            $scope.$digest()
                        }, 750)
                    }
                })
            })

            function appendSkills(skills) {
                let user = $("#player__input").val()

                console.groupCollapsed(user)

                skills.map(index => console.log(JSON.stringify(index, null, 4)))

                let overall = _.filter(skills, {skill: "overall"})

                $scope.skills = _.reject(skills, {skill: "overall"})

                $scope.overall = overall[0]
                $scope.overall_total_level = $scope.overall.level
                $scope.overall_experience  = $scope.overall.exp
                $scope.overall_rank        = $scope.overall.rank

                $scope.player = user
                $scope.form_empty = false

                $scope.overall__combat_level = overall[0].combat_level

                $scope.updateSkillHovered(_.sample($scope.skills))

                $scope.$digest()

                console.groupEnd()
            }

            $scope.updateSkillHovered = function (stat) {
                try {
                    if (stat.skill !== 'overall') {
                        $scope.overall_hovered = false

                        $scope.skillFocusedName = stat.skill
                        $scope.skillFocusedLevel = stat.level
                        $scope.skillFocusedExperience = (stat.exp == -1) ? undefined : stat.exp
                        $scope.skillFocusedVirtualLevel = stat.level_virtual
                        $scope.skillFocusedIsRanked = stat.rank != -1
                        $scope.skillFocusedRank = stat.rank
                        $scope.skillFocusedNextLevel = stat.level === 99 ? 99 : stat.level + 1 // (stat.level_virtual == 127) ? 127 : stat.level_virtual + 1
                        $scope.skillFocusedIsMaxed = stat.exp_til_next_level == 0
                        $scope.skillFocusedExperienceUntilNextLevel = (stat.exp === 200000000) ? `This skill has been maxed!` : (stat.exp == -1) ? undefined : (stat.level === 99) ? 0 : stat.exp_til_next_level
                        $scope.skillFocusedProgressToNextLevel = (stat.level === 99) ? 100 : (stat.level_progress.toFixed(2) < 0.5) ? 0 : stat.level_progress.toFixed(2)
                    } else {
                        $scope.overall_hovered = true

                        $scope.skillFocusedName = 'Overall'
                        $scope.skillFocusedLevel = stat.level
                        $scope.skillFocusedExperience = ($scope.username == 'username') ? $scope.overall_experience : stat.exp
                        $scope.skillFocusedRank = stat.rank
                    }
                } catch(error) {
                    console.log(error)
                    console.log(stat)
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
