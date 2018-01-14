interface Skill {
    skill: string
    rank: number
    exp: number
    level: number
    virtual_level?: number
    exp_to_level?: number
    next_level?: number
    level_progress?: number
}

export default Skill