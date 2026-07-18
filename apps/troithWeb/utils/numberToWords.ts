const ones = [
  '',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Eleven',
  'Twelve',
  'Thirteen',
  'Fourteen',
  'Fifteen',
  'Sixteen',
  'Seventeen',
  'Eighteen',
  'Nineteen'
]
const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']

function convertChunk(n: number): string {
  if (n === 0) return ''
  if (n < 20) return ones[n]
  if (n < 100) return `${tens[Math.floor(n / 10)]} ${ones[n % 10]}`.trim()
  return `${ones[Math.floor(n / 100)]} Hundred ${convertChunk(n % 100)}`.trim()
}

function convertToWords(n: number): string {
  if (n === 0) return 'Zero'

  let result = ''
  if (n >= 10000000) {
    result += `${convertChunk(Math.floor(n / 10000000))} Crore `
    n %= 10000000
  }
  if (n >= 100000) {
    result += `${convertChunk(Math.floor(n / 100000))} Lakh `
    n %= 100000
  }
  if (n >= 1000) {
    result += `${convertChunk(Math.floor(n / 1000))} Thousand `
    n %= 1000
  }
  result += convertChunk(n)
  return result.trim()
}

export function numberToWords(amount: number): string {
  const rupees = Math.floor(Math.abs(amount))
  const paiseRaw = Math.round((Math.abs(amount) - rupees) * 100)

  let result = `${convertToWords(rupees)} Rupees`
  if (paiseRaw > 0) {
    result += ` and ${convertToWords(paiseRaw)} Paise`
  }
  result += ' Only'
  return result
}
