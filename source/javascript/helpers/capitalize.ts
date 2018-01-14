export default function(string: string): string {
    if(!string) {
        return ''
    }

    return string.replace(/(?:^|\s)\S/g, letter => letter.toUpperCase())
}