function round(num): number {
    const match = `${num}`.match(/^-?\d+(?:\.\d{0,2})?/)
    if (match) {
        const computation = parseFloat(match[0])

        if(computation < 0.05) {
            return 0
        } else {
            return computation
        }
    }
    return num
}

export default round