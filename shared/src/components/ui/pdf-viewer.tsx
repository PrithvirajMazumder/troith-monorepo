'use client'
import { Loader } from 'lucide-react'
import { Document, Page, pdfjs } from 'react-pdf'
import { ReactNode, useState } from 'react'

export type PdfViewerProps = {
  pdfBase64: string
  pageWidth?: number
  className?: string
  loader?: ReactNode
  uniqueIdentityForPageKey?: string
}

export const PdfViewer = ({
  pdfBase64,
  loader = (
    <div className="flex flex-col h-full items-center justify-center pt-10 gap-2">
      <Loader className="w-5 h-5 min-w-5 min-h-5 animate-spin" />
      <p className="text-muted-foreground text-xs">PDF Loading...</p>
    </div>
  ),
  ...otherProps
}: PdfViewerProps) => {
  const [totalPages, setTotalPages] = useState<number>(0)
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`

  return (
    <Document
      loading={loader}
      className={otherProps?.className}
      file={`data:application/pdf;base64,${pdfBase64}`}
      onLoadSuccess={(pdf) => {
        setTotalPages(pdf.numPages)
      }}
    >
      {Array.from({ length: totalPages }).map((_, index) => {
        return (
          <Page
            {...(otherProps?.pageWidth ? { width: otherProps.pageWidth } : {})}
            key={`${otherProps?.uniqueIdentityForPageKey ?? ''}-${index}`}
            className="h-[20rem]"
            pageNumber={index + 1}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        )
      })}
    </Document>
  )
}
