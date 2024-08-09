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
    <div className="flex justify-center">
      <Loader className="w-4 h-4 animate-spin" />
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
