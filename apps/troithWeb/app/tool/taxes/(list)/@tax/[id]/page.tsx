'use client'

export default function TaxIdPage({ params: { id: taxId } }: { params: { id: string } }) {
  return <>Tax id: {taxId}</>
}
