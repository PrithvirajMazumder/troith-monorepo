export const getDecimalPart = (num: number) => {
  const numString = num.toString()
  if (numString.includes('.')) {
    return parseInt(numString.split('.')[1], 10)
  }
  return 0
}
