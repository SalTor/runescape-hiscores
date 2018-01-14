export default function(number: number = 0): string {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}