interface Skill {
    skill: string
    rank: number
    experience: number
    level: number
    virtual_level?: number
    experience_to_level?: number
    next_level?: number
    level_progress?: number
}

export default Skill