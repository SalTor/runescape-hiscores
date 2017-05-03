import React, { Component } from "react"

import _ from "lodash"
import axios from "axios"

import Skill from "./types/skill"

import SideBar from "./components/side-bar_component"
import * as SideBarActions from "./actions/side-bar_actions"

import { addCommas } from "./helpers"


interface ApplicationLayout {
    skillNames: string[]
}
class ApplicationLayout extends Component<any, any> {
    constructor() {
        super()

        this.skillNames = ["attack", "hitpoints", "mining", "strength", "agility", "smithing", "defence", "herblore", "fishing", "ranged", "thieving", "cooking", "prayer", "crafting", "firemaking", "magic", "fletching", "woodcutting", "runecrafting", "slayer", "farming", "construction", "hunter"]

        this.state = {
            username_input: ``,
            username_not_found: false,
            username: `username`,
            request_loading: false,
            skills: _.map(this.skillNames, (index) => _.assign({}, {skill: index, level: 1, rank: -1, experience: 0, virtual_level: 1, experience_to_level: 83, level_progress: 0})),
            overall: {
                level: 0,
                experience: 0,
                rank: -1,
                combat_level: 3
            },
            playerinput: null
        }
    }

    componentDidMount() {
        _.assign(_.find(this.state.skills, {skill: "hitpoints"}), { level: 10, virtual_level: 10, experience: 1154 })

        let overall = {
            skill: "overall",
            level: _.sum(_.map(this.state.skills, "level")),
            virtual_level: _.sum(_.map(this.state.skills, "virtual_level")),
            experience: _.sum(_.map(this.state.skills, "experience")),
            rank: -1,
            combat_level: 3
        }

        this.setState({
            username_not_found: false,
            player: "username",
            username: "username",
            form_empty: true,
            request_loading: false,
            overall,
            playerinput: document.getElementById("player__input")
        })
    }

    render() {
        return (
            <div>
                <div className="form" id="player__submission-container">
                    <form className="form-inline player__form" id="player__form" role="form" name="user_lookup" onSubmit={ this.handle_form_submission.bind(this) }>
                        <legend className="form__legend">OSRS Hi-Scores Lookup</legend>

                        <div className="form__label-and-input form__label-and-input_has-loader" id="player__label-and-input">
                            <label className={ `form__label_with-input${ this.state.username_not_found ? ` form__label_warning` : `` }` }>
                                <svg className={ `loading-icon uil-ring-alt${ this.state.request_loading ? ` loading-icon_loading` : `` }` } width="50px" height="50px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"><rect x="0" y="0" width="100" height="100" fill="none" className="bk"></rect><circle cx="50" cy="50" r="40" stroke="#34495e" fill="none" strokeWidth="8" strokeLinecap="round"></circle><circle cx="50" cy="50" r="40" stroke="#efefef" fill="none" strokeWidth="4" strokeLinecap="round"><animate attributeName="stroke-dashoffset" dur="2s" repeatCount="indefinite" from="0" to="502"></animate><animate attributeName="stroke-dasharray"  dur="2s" repeatCount="indefinite" values="150.6 100.4;1 250;150.6 100.4"></animate></circle></svg>

                                <input onChange={ this.handle_form_input_change.bind(this) } value={ this.state.username_input } className="form__input" id="player__input" placeholder="Username" name="username" type="text" required />

                                <button className="btn form__submit" id="player__submit" type="submit">Submit</button>
                            </label>
                        </div>
                    </form>
                </div>

                <div className="stats">
                    <div className="stats__name-combat-and-total">
                        <span className="stats__player-name">
                            { this.state.username }
                        </span>

                        <div className="stats__combat-and-total-level">
                            <span className="stats__combat-level">
                                <img src="assets/other-icons/combat.png" alt="" />
                                <span>{ this.state.overall.combat_level }</span>
                            </span>

                            <span className="stats__total-level" onMouseEnter={ this.updateSkillHovered.bind(this, this.state.overall) }>
                                <img src="assets/other-icons/overall.png" alt="" />
                                <span>{ addCommas(this.state.overall.level) }</span>
                            </span>
                        </div>
                    </div>

                    <div className="stats__skills-and-perspective">
                        <div className="stats__skills">
                            {
                                this.state.skills.map((skill, index) => {
                                    return (
                                        <div className={`skill skill_${ skill.skill }`} onMouseEnter={ this.updateSkillHovered.bind(this, skill) } key={ index }>
                                            <img className={`skill__icon skill__icon_${ skill.skill }`} src={`./assets/skill-icons/${ skill.skill }.png`} />

                                            <div className="skill__level">{ skill.level }</div>
                                        </div>
                                    )
                                })
                            }
                        </div>

                        <SideBar />
                    </div>
                </div>
            </div>
        )
    }


    /**
     *  ===============
     *    Other Stuff
     *  ===============
     */
    handle_form_input_change(event) {
        this.setState({
            username_input: event.target.value.toString().toLowerCase()
        })
    }

    handle_form_submission(event) {
        event.preventDefault()

        this.setState({
            request_loading: true
        })

        // axios.get(`http://rsapi.saltor.nyc:2007/player/${ this.state.username_input }`)
        axios.get(`http://localhost:2007/player/${ this.state.username_input }`)
            .then(response => {
                console.log(`%c✔ %c${ this.state.username_input }`, "color: green;", "color: black;")
                this.appendSkills(response.data)

                this.setState({
                    username: this.state.username_input,
                    username_input: ``,
                    request_loading: false
                })

                this.state.playerinput.blur()
            })
            .catch(() => {
                console.log(`%c✖ %c${ this.state.username_input }`, "color: red;", "color: black;")

                this.setState({
                    request_loading: false,
                    username_not_found: true
                })

                setTimeout(() => {
                    this.setState({
                        username_not_found: false
                    })
                }, 1000)
            })
    }

    appendSkills(player) {
        let skills  = _.reject(player.stats, {skill: "overall"}),
            overall = _.filter(player.stats, {skill: "overall"})[0]

        this.setState({
            skills,
            overall
        })

        console.groupEnd()
    }

    updateSkillHovered(skill: Skill) {
        SideBarActions.registerNewHoveredSkill(skill)
    }
}

export default ApplicationLayout
