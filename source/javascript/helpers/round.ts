function round(number): number {
    let computation = number.toFixed(2)

    if(computation < 0.05) {
        return 0
    } else {
        return computation
    }
}

export default round