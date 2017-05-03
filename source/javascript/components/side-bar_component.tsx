import React, { Component } from "react"

import { round, roundDown, capitalize, addCommas } from "../helpers"

import { SideBarStore } from "../stores/side-bar_store"


class SideBar extends Component<any, any> {
    constructor() {
        super()

        this.state = {
            overall_hovered: false,
            focused_skill: SideBarStore.getFocusedSkill(),
            focused_skill_experience: 0,
            focused_skill_rank: -1,
            focused_skill_level: 1,
            focused_skill_next_level: 2,
            focused_skill_experience_to_next_level: 83,
            focused_skill_percent_progress_to_next_level: 0,
            focused_skill_virtual_level: 1
        }
    }

    componentWillMount() {
        SideBarStore.on("NEW_SKILL_FOCUS", this.handle_change_in_focus.bind(this))
    }

    componentWillUnmount() {
        SideBarStore.removeAllListeners()
    }

    render() {
        return (
            <div className="stats__perspective other-side-bar-info">
                <h4 className="skill__name">{ capitalize(this.state.focused_skill) }</h4>

                <div className={ `skill__experience-and-rank${ this.state.overall_hovered ? ` skill__experience-and-rank_overall` : `` }` }>
                    <span id="experience">
                        <span>{ addCommas(this.state.focused_skill_experience) }xp</span>
                    </span>

                    {this.state.focused_skill_rank > -1 ? (
                        <span id="rank">Rank: { addCommas(this.state.focused_skill_rank) }</span>
                    ) : <span id="no-rank">Not ranked</span> }
                </div>

                {!this.state.overall_hovered ? (
                    <div className="progress skill__progress-bar-container">
                        <div className="progress-bar progress-bar-striped bootstrap-progress-bar" id="progress__bar" aria-valuenow={ roundDown(this.state.focused_skill_percent_progress_to_next_level ) } aria-valuemin="0"  aria-valuemax="100" role="progressbar">
                            <span className="sr-only"></span>
                        </div>
                    </div>
                ) : null }

                {!this.state.overall_hovered ? (
                    <div className="skill__progress-and-experience-left">
                        {!this.state.skillFocusedIsMaxed ? (
                            <span id="progress">
                                { round(this.state.focused_skill_percent_progress_to_next_level) }% towards level { this.state.focused_skill_next_level }
                            </span>
                        ) : null }

                        {!this.state.skillFocusedIsMaxed ? (
                            <span id="experience-left">
                                { this.state.focused_skill_experience_to_next_level ? (
                                    <span>
                                        { addCommas(this.state.focused_skill_experience_to_next_level) }xp left
                                    </span>
                                ) : <span>??? xp left</span> }
                            </span>
                        ) : <span id="experience-left--maxed">This skill has been maxed!</span> }
                    </div>
                ) : null }
            </div>

        )
    }


    handle_change_in_focus(focused_stat) {
        let { overall_hovered, focused_skill, focused_skill_experience, focused_skill_rank, focused_skill_level, focused_skill_next_level, focused_skill_experience_to_next_level, focused_skill_percent_progress_to_next_level, focused_skill_virtual_level } = focused_stat

        this.setState({
            overall_hovered,
            focused_skill,
            focused_skill_experience,
            focused_skill_rank,
            focused_skill_level,
            focused_skill_next_level,
            focused_skill_experience_to_next_level,
            focused_skill_percent_progress_to_next_level,
            focused_skill_virtual_level
        })
    }
}

export default SideBar