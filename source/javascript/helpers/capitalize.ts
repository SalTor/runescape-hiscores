function capitalize(string: string): string {
    return string.replace(/(?:^|\s)\S/g, letter => letter.toUpperCase())
}

export default capitalize