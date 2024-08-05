'use client'
import { useEffect, useRef, useState } from 'react'

export function useDebounce(value: string | number, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  const timer = useRef(null)

  useEffect(() => {
    clearTimeout(timer.current as any)

    timer.current = setTimeout(() => {
      setDebouncedValue(value)
    }, delay) as any
  }, [value, delay])

  return debouncedValue
}
