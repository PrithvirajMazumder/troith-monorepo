'use client'
import {
  Button,
  Input,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  ScrollArea,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@troith/shared/components/ui'
import { H3, P } from '@troith/shared/components/typography'
import { Download, Pencil, SlidersHorizontal, Trash } from 'lucide-react'

const ToolLayout = () => {
  return (
    <TooltipProvider>
      <ResizablePanelGroup direction="horizontal" className="!h-screen border-r">
        <ResizablePanel maxSize={15} minSize={5} defaultSize={15} className="h-full hidden md:block">
          <div>
            <header className="h-16 flex items-center">
              <Button variant="ghost" className="text-3xl font-bold">
                <span className="text-primary">T</span>roith
              </Button>
            </header>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle className="hidden md:flex" />
        <ResizablePanel defaultSize={85}>
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={50}>
              <header className="border-b px-4 h-16 flex items-center gap-2">
                <H3>Invoices</H3>
                <Input className="ml-auto max-w-36 w-full" placeholder="Search" />
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <SlidersHorizontal className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <P>Filters</P>
                  </TooltipContent>
                </Tooltip>
              </header>
              <ScrollArea className="p-4">
                <span className="font-semibold">Two</span>
              </ScrollArea>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50} minSize={30} maxSize={50}>
              <header className="border-b px-4 py-4 h-16 flex items-center">
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <P>Delete</P>
                  </TooltipContent>
                </Tooltip>
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <P>Archive</P>
                  </TooltipContent>
                </Tooltip>
                <Separator orientation="vertical" className="mx-2" />
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <P>Download</P>
                  </TooltipContent>
                </Tooltip>
              </header>
              <ScrollArea className="h-full p-6">
                <span className="font-semibold">Two</span>
              </ScrollArea>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  )
}

export default ToolLayout
