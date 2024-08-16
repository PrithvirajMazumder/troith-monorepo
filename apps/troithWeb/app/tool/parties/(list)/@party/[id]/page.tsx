'use client'

export default function PartyIdPage({ params: { id: partyId } }: { params: { id: string } }) {
  return <>party id: {partyId}</>
}
