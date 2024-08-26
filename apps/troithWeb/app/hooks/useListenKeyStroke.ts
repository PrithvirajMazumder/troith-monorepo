import { useEffect, useState } from 'react'

export type useListenKeyStrokeProps = {
  keyList: string[]
  triggerKeys?: Partial<
    Pick<KeyboardEvent, 'metaKey' | 'altKey' | 'ctrlKey' | 'shiftKey'> & {
      shouldCheckAll: boolean
    }
  >
}

export const useListenKeyStroke = ({ keyList, triggerKeys }: useListenKeyStrokeProps) => {
  const [shouldOpen, setShouldOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const checkTriggerKeys = () => {
        if (triggerKeys) {
          const { shouldCheckAll, ...keys } = triggerKeys
          const requiredKeys = Object.keys(keys)
          // @ts-expect-error requiredKey is string but keys of event are not string
          const pressedRequiredKeys = requiredKeys.filter((requiredKey) => e[requiredKey])
          return shouldCheckAll ? pressedRequiredKeys.length === requiredKeys.length : !!pressedRequiredKeys.length
        }

        return true
      }
      if (keyList.includes(e.key) && (triggerKeys ? checkTriggerKeys() : true)) {
        e.preventDefault()
        setShouldOpen(true)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return {
    shouldOpen,
    setShouldOpen
  }
}
