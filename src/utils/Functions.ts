export function getRandomInt(length: number) {
    return Math.floor(Math.random() * length)
}

export function getRandomIntRange(min: number, max: number) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * ((max - min) + 1))
}