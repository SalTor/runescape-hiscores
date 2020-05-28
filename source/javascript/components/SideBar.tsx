import React, { Fragment } from 'react'
import cn from 'classnames'

import { round, roundDown, capitalize, addCommas } from '../helpers'

import Stat from '../types/stat'


const SideBar = props => {
    const { focusedStat: stat } = props
    const overallFocused = stat.skill === 'overall'
    const noStats = stat.rank < 0
    return (
        <div className="stats__perspective other-side-bar-info">
            <h4 className="skill__name">{capitalize(stat.skill)}</h4>
            {noStats && <p style={{textAlign: 'center'}}>Rank too low for details</p>}

            <div className={cn('skill__experience-and-rank', overallFocused && 'skill__experience-and-rank_overall')}>
                {noStats ? null : (
                    <Fragment>
                        <span id="experience">
                            <span>{addCommas(stat.experience)}xp</span>
                        </span>

                        {stat.rank > -1 ? (
                            <span id="rank">Rank: {addCommas(stat.rank)}</span>
                        ) : <span id="no-rank">Not ranked</span> }
                    </Fragment>
                )}
            </div>

            {(overallFocused || noStats) || (
                <Fragment>
                    <div className="progress skill__progress-bar-container">
                        <div
                            className="progress-bar progress-bar-striped bootstrap-progress-bar"
                            id="progress__bar"
                            aria-valuenow={roundDown(stat.level_progress)}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            role="progressbar"
                        >
                            <span className="sr-only" />
                        </div>
                    </div>

                    <div className="skill__progress-and-experience-left">
                        {stat.exp_to_level === 0 || (
                            <span id="progress">
                                {round(stat.level_progress)}% towards level {stat.virtual_level + 1}
                            </span>
                        )}

                        <span id="experience-left">
                            {
                                stat.exp_to_level > 0 ? (
                                    <span>
                                        {addCommas(stat.exp_to_level)}xp left
                                    </span>
                                ) : (
                                    stat.rank < 0 ? null : <span>skill has been maxed!</span>
                                )
                            }
                        </span>
                    </div>
                </Fragment>
            )}

            {
                props.closestThreeStatsToLevel.length > 0 ? (
                    <div className="perspective__closest-to-leveling">
                        <div className="perspective__skill-wrapper">
                            {
                                props.closestThreeStatsToLevel.map((stat: Stat) =>
                                    stat &&
                                    <div
                                        className="skill skill_insight"
                                        onMouseEnter={() => props.onSkillHovered(stat)}
                                        key={`closeToLeveling-${stat.skill}`}
                                    >
                                        <img
                                            className={`skill__icon skill__icon_insight skill__icon_${stat.skill}`}
                                            src={`./assets/skill-icons/${stat.skill}.png`}
                                            alt={`${capitalize(stat.skill)} icon`}
                                        />
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

export default SideBar