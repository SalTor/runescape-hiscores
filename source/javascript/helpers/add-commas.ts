function addCommas(number: number): string {
    if (number) {
        return `${number}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }
    return `${number}`
}

export default addCommas