import EventsEmitter from 'events'
import dispatcher from '../event-dispatcher'

import _ from 'lodash'

import Skill from '../types/skill'
import Action from '../types/action'


class SideBarStateManagement extends EventsEmitter {
    private focused_skill: string
    private overall_hovered: boolean
    private focused_skill_level: number
    private focused_skill_experience: number
    private focused_skill_virtual_level: number
    private focused_skill_rank: number
    private focused_skill_next_level: number
    private focused_skill_experience_to_next_level: number
    private focused_skill_percent_progress_to_next_level: number
    private closest_skills_to_leveling: object[]

    constructor() {
        super()

        this.focused_skill = _.nth(['attack', 'strength', 'defence', 'hitpoints', 'ranged', 'magic', 'prayer', 'runecrafting', 'construction', 'agility', 'herblore', 'thieving', 'crafting', 'fletching', 'slayer', 'hunter', 'mining', 'smithing', 'fishing', 'cooking', 'firemaking', 'woodcutting', 'farming'], _.random(23))
        this.overall_hovered = false
        this.focused_skill_level = 1
        this.focused_skill_virtual_level = 1
        this.focused_skill_experience = 0
        this.focused_skill_rank = -1
        this.focused_skill_next_level = 2
        this.focused_skill_experience_to_next_level = 83
        this.focused_skill_percent_progress_to_next_level = 0
        this.closest_skills_to_leveling = [{}, {}, {}]
    }

    getFocusedSkill() {
        return this.focused_skill
    }

    getClosestSkills() {
        return this.closest_skills_to_leveling
    }

    getState() {
        const { overall_hovered, focused_skill, focused_skill_level, focused_skill_virtual_level, focused_skill_experience, focused_skill_rank, focused_skill_next_level, focused_skill_experience_to_next_level, focused_skill_percent_progress_to_next_level } = this

        return {
            overall_hovered,
            focused_skill,
            focused_skill_level,
            focused_skill_virtual_level,
            focused_skill_experience,
            focused_skill_rank,
            focused_skill_next_level,
            focused_skill_experience_to_next_level,
            focused_skill_percent_progress_to_next_level
        }
    }

    registerNewHoveredSkill(new_skill: Skill) {
        const { skill, level, rank, exp, virtual_level, exp_to_level, level_progress } = new_skill

        this.focused_skill = skill
        this.focused_skill_level = level
        this.focused_skill_rank = rank
        this.focused_skill_experience = exp

        if(skill == 'overall') {
            this.overall_hovered = true
        } else {
            this.overall_hovered = false

            this.focused_skill_virtual_level = virtual_level
            this.focused_skill_next_level = virtual_level + 1
            this.focused_skill_experience_to_next_level = exp_to_level
            this.focused_skill_percent_progress_to_next_level = level_progress
        }

        this.emit('NEW_SKILL_FOCUS', this.getState())
    }

    registerNewUserStats(stats) {
        this.registerNewHoveredSkill(stats.find(stat => stat.skill === this.focused_skill))
    }

    registerClosestThreeStatsToLeveling(stats) {
        this.closest_skills_to_leveling = stats

        this.emit('CLOSEST_THREE_STATS_TO_LEVELING', this.closest_skills_to_leveling)
    }
}

const SideBarStore = new SideBarStateManagement()

const SideBarEventDispatcher = dispatcher.register(function (payload: Action) {
    switch(payload.action) {
        case 'REGISTER_NEW_HOVERED_SKILL':
            SideBarStore.registerNewHoveredSkill(payload.data)
            break
        case 'NEW_USER_STATS':
            SideBarStore.registerNewUserStats(payload.data)
            break
        case 'CLOSEST_THREE_STATS_TO_LEVELING':
            SideBarStore.registerClosestThreeStatsToLeveling(payload.data)
            break
        default:
            break
    }
})

export { SideBarStore, SideBarEventDispatcher }