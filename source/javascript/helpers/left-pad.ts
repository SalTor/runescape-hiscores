function leftPad(value: number): string {
    return value < 10 ? "0".concat(value.toString()) : value.toString()
}

export default leftPad