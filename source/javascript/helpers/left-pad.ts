export default function(value: number): string {
    return value < 10 ? '0'.concat(value.toString()) : value.toString()
}