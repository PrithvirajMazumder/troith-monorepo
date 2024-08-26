import { useListenKeyStroke } from '@troithWeb/app/hooks/useListenKeyStroke'

export const useToolCommand = () => {
  const { shouldOpen, setShouldOpen } = useListenKeyStroke({
    keyList: ['k'],
    triggerKeys: {
      ctrlKey: true,
      metaKey: true
    }
  })

  return {
    shouldOpen,
    setShouldOpen
  }
}
