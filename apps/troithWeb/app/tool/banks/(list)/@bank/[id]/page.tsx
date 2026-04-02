'use client'

export default function BankIdPage({ params: { id: bankId } }: { params: { id: string } }) {
  return <>Bank id: {bankId}</>
}
