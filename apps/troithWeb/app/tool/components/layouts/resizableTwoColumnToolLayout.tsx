'use client'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@troith/shared'
import { ReactNode } from 'react'

type Props = {
  firstCol: ReactNode
  firstColClassName?: string
  secondCol?: ReactNode
  secondColClassName?: string
  autoSaveId?: string
  onResize?: (size: number) => void
  shouldShowHandle?: boolean
}

export const ResizableTwoColumnToolLayout = ({ firstCol, secondCol, shouldShowHandle = true, ...otherProps }: Props) => (
  <ResizablePanelGroup
    {...(otherProps?.autoSaveId?.length
      ? {
          autoSaveId: otherProps.autoSaveId
        }
      : {})}
    direction="horizontal"
  >
    <ResizablePanel defaultSize={60} className={otherProps.firstColClassName}>
      <div className="h-full w-full">{firstCol}</div>
    </ResizablePanel>
    {secondCol ? (
      <>
        {shouldShowHandle && <ResizableHandle withHandle />}
        <ResizablePanel
          {...(otherProps?.onResize ? { onResize: otherProps.onResize } : {})}
          className={otherProps.secondColClassName}
          defaultSize={40}
          minSize={30}
          maxSize={50}
        >
          <div className="h-full w-full">{secondCol}</div>
        </ResizablePanel>
      </>
    ) : null}
  </ResizablePanelGroup>
)
