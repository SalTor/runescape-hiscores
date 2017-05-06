import dispatcher from "../event-dispatcher"
import Skill from "../types/skill"


export function registerNewHoveredSkill(skill_to_register: Skill) {
    dispatcher.dispatch({
        action: "REGISTER_NEW_HOVERED_SKILL",
        data: skill_to_register
    })
}

export function registerNewUserStats(stats) {
    dispatcher.dispatch({
        action: "NEW_USER_STATS",
        data: stats
    })
}
