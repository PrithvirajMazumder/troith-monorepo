'use client'

export default function ItemIdPage({ params: { id: itemId } }: { params: { id: string } }) {
  return <>item id: {itemId}</>
}
