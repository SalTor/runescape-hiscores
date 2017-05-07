function round(number): number {
    let computation = parseFloat(number.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0])

    if(computation < 0.05) {
        return 0
    } else {
        return computation
    }
}

export default round