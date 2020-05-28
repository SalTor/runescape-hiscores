import React, { useReducer, useRef } from 'react'

import { reduce, nth, random } from 'lodash-es'
import axios from 'axios'
import cn from 'classnames'

import Stat from './types/stat'

import { statNames } from './constants'

import { addCommas, capitalize } from './helpers'

import SideBar from './components/SideBar'


interface AppState {
    closestThreeStatsToLevel: Stat[];
    focusedStat: Stat;
    overall: Stat;
    playerName: string;
    playerNotFound: Boolean;
    requestLoading: Boolean;
    stats: Stat[];
    username: string;
}
const initialReducer = (currentState, newState) => ({ ...currentState, ...newState })
const stats: Stat[] = statNames.map(skill => {
    if (skill === 'hitpoints') {
        return {
            exp_to_level: 204,
            exp: 1154,
            level_progress: 0,
            level: 10,
            next_level: 11,
            rank: -1,
            skill,
            virtual_level: 10,
        }
    }
    return {
        exp_to_level: 83,
        exp: 0,
        level_progress: 0,
        level: 1,
        next_level: 2,
        rank: -1,
        skill,
        virtual_level: 1,
    }
})
const sum = (list: Stat[], property: string) => reduce(list, (acc, curr) => acc + curr[property] || 0, 0)
const App = () => {
    const playerInputRef = useRef(null)
    const [state, setState]: [AppState, Function] = useReducer(initialReducer, {
        closestThreeStatsToLevel: [],
        focusedStat: nth(stats, random(23)),
        overall: {
            combat_level: 3,
            exp: sum(stats, 'experience'),
            level_progress: 0,
            level: sum(stats, 'level'),
            rank: -1,
            skill: 'overall',
            virtual_level: sum(stats, 'virtual_level'),
        },
        playerName: '',
        playerNotFound: false,
        requestLoading: false,
        stats,
        username: 'username',
    })

    const handle_form_input_change = (event: React.ChangeEvent<HTMLInputElement>) => setState({ playerName: event.target.value.toString().toLowerCase() })

    const appendSkills = (list: Stat[]) => {
        const stats: Stat[] = []
        let overall: Stat
        let focusedStat: Stat

        for (let stat of list) {
            if (stat.skill === 'overall') {
                overall = stat
            } else {
                stats.push(stat)
            }
            if (stat.skill === state.focusedStat.skill) {
                focusedStat = stat
            }
        }

        setState({ overall, stats, focusedStat })
    }

    const handle_form_submission = (event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault()

        setState({ requestLoading: true })

        axios.get(`http://rsapi.saltor.nyc:2007/player/${state.playerName}`)
            .then(response => {
                appendSkills(response.data.stats)

                setState({
                    username: state.playerName,
                    playerName: '',
                    requestLoading: false,
                    closestThreeStatsToLevel: response.data.closest,
                })

                if (playerInputRef && playerInputRef.current) {
                    playerInputRef.current.blur()
                }
            })
            .catch(() => {
                setState({ requestLoading: false, playerNotFound: true })

                setTimeout(() => {
                    setState({ playerNotFound: false })
                }, 1000)
            })
    }

    const updateSkillHovered = (focusedStat: Stat) => setState({ focusedStat })

    return (
        <div>
            <div className="form" id="player__submission-container">
                <form className="form-inline player__form" id='player__form' role='form' name='user_lookup' onSubmit={handle_form_submission}>
                    <legend className="form__legend">OSRS Hi-Scores Lookup</legend>

                    <div className="form__label-and-input form__label-and-input_has-loader" id="player__label-and-input">
                        <label className={cn("form__label_with-input", state.playerNotFound && "form__label_warning")}>
                            <svg
                                className={cn("loading-icon uil-ring-alt", state.requestLoading && "loading-icon_loading")}
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
                                value={state.playerName}
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
                        focusedStat={state.focusedStat}
                        onSkillHovered={updateSkillHovered}
                        closestThreeStatsToLevel={state.closestThreeStatsToLevel}
                    />
                </div>
            </div>
        </div>
    )
}

export default App