export const convertAmountToInr = (amount: string | number, isRupeesRequired = true) => {
  const inrAmount = amount?.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR'
  })

  return isRupeesRequired ? inrAmount : inrAmount?.replace('₹', '')
}
