import dayjs from "dayjs"

export function truncateAddress(address: string, length: number): string {
    return `${address.substring(0, length + 2)}...${address.substring(
        address.length - length,
        address.length
    )}`
}

export function calculatePostTimeLeft(createdTime: number, flameCount: number) {
    const timePerFlame = 5
    const postTimeInMinutes = timePerFlame * flameCount

    const postTime = dayjs.unix(createdTime).add(postTimeInMinutes, "m")
    const now = dayjs()
    const timeLeft = postTime.diff(now, "m", true)

    return timeLeft
}
