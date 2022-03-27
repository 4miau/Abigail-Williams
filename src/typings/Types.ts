const reactOptions = ['SINGLELOCK'] as const
export type ReactOptions = (typeof reactOptions)[number]
export const isReactOption = (val: any): val is ReactOptions => reactOptions.includes(val)