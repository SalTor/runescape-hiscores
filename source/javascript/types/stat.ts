interface Stat {
    skill: string;
    rank: number;
    exp: number;
    level: number;
    virtual_level: number;
    exp_to_level: number;
    next_level: number;
    level_progress?: number;
    combat_level?: number;
}

export default Stat