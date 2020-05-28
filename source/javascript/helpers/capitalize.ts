function capitalize(str: string): string {
    if (str) {
        return str.replace(/(?:^|\s)\S/g, letter => letter.toUpperCase())
    }
    return `${str}`
}

export default capitalize