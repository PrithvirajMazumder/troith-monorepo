import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export default function Index() {
  return (
    <>
      <Link href={'/tool'} className="text-2xl">
        Tool <ChevronRight />
      </Link>
    </>
  )
}
