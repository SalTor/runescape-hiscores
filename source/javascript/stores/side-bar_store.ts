import EventsEmitter from "events"
import dispatcher from "../event-dispatcher"

import Skill from "../types/skill"
import Action from "../types/action"


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

    constructor() {
        super()

        this.focused_skill = "Sailing"
        this.overall_hovered = false
        this.focused_skill_level = 1
        this.focused_skill_virtual_level = 1
        this.focused_skill_experience = 0
        this.focused_skill_rank = -1
        this.focused_skill_next_level = 2
        this.focused_skill_experience_to_next_level = 83
        this.focused_skill_percent_progress_to_next_level = 0
    }

    getFocusedSkill() {
        return this.focused_skill
    }

    getState() {
        return {
            overall_hovered: this.overall_hovered,
            focused_skill: this.focused_skill,
            focused_skill_level: this.focused_skill_level,
            focused_skill_virtual_level: this.focused_skill_virtual_level,
            focused_skill_experience: this.focused_skill_experience,
            focused_skill_rank: this.focused_skill_rank,
            focused_skill_next_level: this.focused_skill_next_level,
            focused_skill_experience_to_next_level: this.focused_skill_experience_to_next_level,
            focused_skill_percent_progress_to_next_level: this.focused_skill_percent_progress_to_next_level
        }
    }

    registerNewHoveredSkill(new_skill: Skill) {
        let { skill, level, rank, experience, virtual_level, experience_to_level, level_progress } = new_skill

        this.focused_skill = skill
        this.focused_skill_level = level
        this.focused_skill_rank = rank
        this.focused_skill_experience = experience

        if(skill == "overall") {
            this.overall_hovered = true
        } else {
            this.overall_hovered = false

            this.focused_skill_virtual_level = virtual_level
            this.focused_skill_next_level = virtual_level + 1
            this.focused_skill_experience_to_next_level = experience_to_level
            this.focused_skill_percent_progress_to_next_level = level_progress
        }

        this.emit("NEW_SKILL_FOCUS", this.getState())
    }
}

let SideBarStore = new SideBarStateManagement()

let SideBarEventDispatcher = dispatcher.register(function (payload: Action) {
    switch(payload.action) {
        case "REGISTER_NEW_HOVERED_SKILL":
            SideBarStore.registerNewHoveredSkill(payload.data)
            break
        default:
            break
    }
})

export { SideBarStore, SideBarEventDispatcher }