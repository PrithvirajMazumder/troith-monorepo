'use client'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@troith/shared'
import { ReactNode } from 'react'

type Props = {
  firstCol: ReactNode
  secondCol?: ReactNode
}

export const ResizableTwoColumnToolLayout = ({ firstCol, secondCol }: Props) => (
  <ResizablePanelGroup direction="horizontal">
    <ResizablePanel defaultSize={50}>
      <div className="h-full w-full">{firstCol}</div>
    </ResizablePanel>
    {secondCol ? (
      <>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50} minSize={30} maxSize={50}>
          <div className="h-full w-full">{secondCol}</div>
        </ResizablePanel>
      </>
    ) : null}
  </ResizablePanelGroup>
)
