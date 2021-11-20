import { timestampBasedId } from 'extra-generator'

const iter = timestampBasedId()

export function createTimeBasedId(): [timestamp: number, num: number] {
  return iter.next().value
}

export function stringifyTimeBasedId(
  [timestamp, num]: [timestamp: number, num: number]
): string {
  const timestampString = timestamp.toString().padStart(20, '0')
  const numString = num.toString()
  return `${timestampString}-${numString}`
}
