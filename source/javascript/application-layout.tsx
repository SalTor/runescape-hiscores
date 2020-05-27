import React, { useReducer, useRef } from 'react'

import { reduce, nth, random } from 'lodash-es'
import axios from 'axios'
import cn from 'classnames'

import Stat from './types/stat'

import { addCommas, capitalize } from './helpers'

import SideBar from './components/side-bar_component'


interface ApplicationLayout {
    skillNames: string[]
    skills: any
    player_input: any
}
interface Temp {
    username_input: string;
    username_not_found: Boolean;
    username: string;
    player: string;
    request_loading: Boolean;
    stats: Stat[];
    overall: Stat;
    form_empty: Boolean;
    focused_stat: Stat;
    closestThreeStatsToLevel: Stat[];
}
const initialReducer = (currentState, newState) => ({ ...currentState, ...newState })
const skillNames = ['attack', 'hitpoints', 'mining', 'strength', 'agility', 'smithing', 'defence', 'herblore', 'fishing', 'ranged', 'thieving', 'cooking', 'prayer', 'crafting', 'firemaking', 'magic', 'fletching', 'woodcutting', 'runecrafting', 'slayer', 'farming', 'construction', 'hunter']
const stats: Stat[] = skillNames.map(skill => {
    if (skill === 'hitpoints') {
        return {
            skill,
            level: 10,
            rank: -1,
            virtual_level: 10,
            exp: 1154,
            exp_to_level: 204,
            level_progress: 0,
            next_level: 11,
        }
    }
    return {
        skill,
        level: 1,
        rank: -1,
        exp: 0,
        virtual_level: 1,
        exp_to_level: 83,
        level_progress: 0,
        next_level: 2,
    }
})
const sum = (list: Stat[], property: string) => reduce(list, (acc, curr) => acc + curr[property] || 0, 0)
const ApplicationLayout = () => {
    const playerInputRef = useRef(null)
    const [state, setState]: [Temp, Function] = useReducer(initialReducer, {
        username_input: '',
        username_not_found: false,
        username: 'username',
        player: 'username',
        request_loading: false,
        stats,
        overall: {
            skill: 'overall',
            level: sum(stats, 'level'),
            virtual_level: sum(stats, 'virtual_level'),
            exp: sum(stats, 'experience'),
            rank: -1,
            combat_level: 3,
            level_progress: 0
        },
        form_empty: true,
        focused_stat: nth(stats, random(23)),
        closestThreeStatsToLevel: [],
    })

    const handle_form_input_change = (event: React.ChangeEvent<HTMLInputElement>) => setState({ username_input: event.target.value.toString().toLowerCase() })

    const appendSkills = (list: Stat[]) => {
        const stats: Stat[] = []
        let overall: Stat
        let focused_stat: Stat

        for (let stat of list) {
            if (stat.skill === 'overall') {
                overall = stat
            } else {
                stats.push(stat)
            }
            if (stat.skill === state.focused_stat.skill) {
                focused_stat = stat
            }
        }

        setState({ overall, stats, focused_stat })
    }

    const handle_form_submission = (event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault()

        setState({ request_loading: true })

        axios.get(`http://rsapi.saltor.nyc:2007/player/${state.username_input}`)
            .then(response => {
                appendSkills(response.data.stats)

                setState({
                    username: state.username_input,
                    username_input: ``,
                    request_loading: false,
                    closestThreeStatsToLevel: response.data.closest,
                })

                if (playerInputRef && playerInputRef.current) {
                    playerInputRef.current.blur()
                }
            })
            .catch(() => {
                setState({ request_loading: false, username_not_found: true })

                setTimeout(() => {
                    setState({ username_not_found: false })
                }, 1000)
            })
    }

    const updateSkillHovered = (focused_stat: Stat) => setState({ focused_stat })

    return (
        <div>
            <div className="form" id="player__submission-container">
                <form className="form-inline player__form" id='player__form' role='form' name='user_lookup' onSubmit={handle_form_submission}>
                    <legend className="form__legend">OSRS Hi-Scores Lookup</legend>

                    <div className="form__label-and-input form__label-and-input_has-loader" id="player__label-and-input">
                        <label className={cn("form__label_with-input", state.username_not_found && "form__label_warning")}>
                            <svg
                                className={cn("loading-icon uil-ring-alt", state.request_loading && "loading-icon_loading")}
                                width="50px"
                                height="50px"
                                viewBox="0 0 100 100"
                                preserveAspectRatio="xMidYMid"
                            >
                                <rect x="0" y="0" width="100" height="100" fill="none" className="bk"></rect>
                                <circle cx="50" cy="50" r="40" stroke="#34495e" fill="none" strokeWidth="8" strokeLinecap="round"></circle>
                                <circle cx="50" cy="50" r="40" stroke="#efefef" fill="none" strokeWidth="4" strokeLinecap="round">
                                    <animate attributeName="stroke-dashoffset" dur="2s" repeatCount="indefinite" from="0" to="502"></animate>
                                    <animate attributeName="stroke-dasharray"  dur="2s" repeatCount="indefinite" values="150.6 100.4;1 250;150.6 100.4"></animate>
                                </circle>
                            </svg>

                            <input
                                ref={playerInputRef}
                                required
                                onChange={handle_form_input_change}
                                value={state.username_input}
                                className="form__input"
                                id="player__input"
                                placeholder="Username"
                                name="username"
                                type="text"
                            />

                            <button className="btn form__submit" id="player__submit" type="submit">Submit</button>
                        </label>
                    </div>
                </form>
            </div>

            <div className="stats">
                <div className="stats__name-combat-and-total">
                    <span className="stats__player-name">
                        {state.username}
                    </span>

                    <div className="stats__combat-and-total-level">
                        <span className="stats__combat-level">
                            <img src="assets/other-icons/combat.png" alt="" />
                            <span>{state.overall.combat_level}</span>
                        </span>

                        <span className="stats__total-level" onMouseEnter={() => updateSkillHovered(state.overall)}>
                            <img src="assets/other-icons/overall.png" alt="" />
                            <span>{addCommas(state.overall.level)}</span>
                        </span>
                    </div>
                </div>

                <div className="stats__skills-and-perspective">
                    <div className="stats__skills">
                        {state.stats.map(stat =>
                            <div key={stat.skill} className={`skill skill_${stat.skill}`} onMouseEnter={() => updateSkillHovered(stat)}>
                                <img
                                    className={`skill__icon skill__icon_${stat.skill}`}
                                    src={`./assets/skill-icons/${stat.skill}.png`}
                                    alt={`${ capitalize(stat.skill)} icon`}
                                />

                                <div className="skill__level">{stat.level}</div>
                            </div>
                        )}
                    </div>

                    <SideBar
                        focused_stat={state.focused_stat}
                        onSkillHovered={updateSkillHovered}
                        closestThreeStatsToLevel={state.closestThreeStatsToLevel}
                    />
                </div>
            </div>
        </div>
    )
}

export default ApplicationLayout