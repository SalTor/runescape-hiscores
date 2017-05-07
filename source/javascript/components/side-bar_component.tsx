import React, { Component } from "react"

import { round, roundDown, capitalize, addCommas } from "../helpers"

import { SideBarStore } from "../stores/side-bar_store"
import * as SideBarActions from "../actions/side-bar_actions"


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
            focused_skill_virtual_level: 1,
            closest_skills_to_leveling: []
        }
    }

    componentWillMount() {
        SideBarStore.on("NEW_SKILL_FOCUS", this.handle_change_in_focus)
        SideBarStore.on("CLOSEST_THREE_STATS_TO_LEVELING", this.handle_closest_stats)
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
                        {
                            this.state.focused_skill_experience_to_next_level !== 0 ? (
                                <span id="progress">
                                    { round(this.state.focused_skill_percent_progress_to_next_level) }% towards level { this.state.focused_skill_next_level }
                                </span>
                            ) : null
                        }

                        <span id="experience-left">
                            {
                                this.state.focused_skill_experience_to_next_level > 0 ? (
                                    <span>
                                        { addCommas(this.state.focused_skill_experience_to_next_level) }xp left
                                    </span>
                                ) : <span>This skill has been maxed!</span>
                            }
                        </span>
                    </div>
                ) : null }

                {
                    this.state.closest_skills_to_leveling.length > 0 ? (
                        <div className="perspective__closest-to-leveling">
                            <div className="perspective__skill-wrapper">
                                {
                                    this.state.closest_skills_to_leveling.map((stat, index) =>
                                        <div onMouseEnter={ this.handle_insight_entry_hovered.bind(this, stat) } className="skill skill_insight" key={ index }>
                                            <img className={`skill__icon skill__icon_insight skill__icon_${ stat.skill }`} src={`./assets/skill-icons/${ stat.skill }.png`} alt={ `${ capitalize(stat.skill) } icon` } />
                                        </div>
                                    )
                                }
                            </div>
                            <p className="perspective__closest-title">closest to leveling</p>
                        </div>
                    ) : null
                }
            </div>

        )
    }


    handle_change_in_focus = (focused_stat) => {
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

    handle_closest_stats = (closest_stats) => {
        this.setState({
            closest_skills_to_leveling: closest_stats
        })
    }

    handle_insight_entry_hovered = (skill) => {
        SideBarActions.registerNewHoveredSkill(skill)
    }
}

export default SideBar