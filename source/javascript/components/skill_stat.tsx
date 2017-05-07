import React, { Component } from "react"

import Skill from "../types/skill"

import * as SideBarActions from "../actions/side-bar_actions"

import { capitalize } from "../helpers"


class SkillStat extends Component<any, any> {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className={`skill skill_${ this.props.data.skill }`} onMouseEnter={ this.updateSkillHovered.bind(this, this.props.data) }>
                <img className={`skill__icon skill__icon_${ this.props.data.skill }`}
                     src={`./assets/skill-icons/${ this.props.data.skill }.png`}
                     alt={ `${ capitalize(this.props.data.skill) } icon` } />

                <div className="skill__level">{ this.props.data.level }</div>
            </div>
        )
    }


    updateSkillHovered(skill: Skill) {
        SideBarActions.registerNewHoveredSkill(skill)
    }
}

export default SkillStat
