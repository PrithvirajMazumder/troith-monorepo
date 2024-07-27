export const capitalize = (str: string): string =>
  str
    .split(' ')
    .map((str) => `${str.charAt(0).toUpperCase()}${str.slice(1)}`)
    .join(' ')
