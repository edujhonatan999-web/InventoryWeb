'use client'

import { useMemo, useState } from 'react'
import { Download } from 'lucide-react'
import { jsPDF } from 'jspdf'
import * as XLSX from 'xlsx'

import { Button } from '@/components/ui/button'

type ExportValue = string | number | boolean | null | undefined

type ExportColumn<T> = {
  key: keyof T
  label: string
  format?: (value: ExportValue, row: T) => string
}

interface ButtonExportProps<T> {
  data: T[]
  columns: ExportColumn<T>[]
  format?: 'xlsx' | 'pdf'
  filename?: string
  sheetName?: string
  label?: string
}

export default function ButtonExport<T>({
  data,
  columns,
  format = 'xlsx',
  filename = format === 'pdf' ? 'export.pdf' : 'export.xlsx',
  sheetName = 'Export',
  label = 'Export',
}: ButtonExportProps<T>) {
  const [isExporting, setIsExporting] = useState(false)

  const exportRows = useMemo(() => {
    if (!data.length) {
      return []
    }

    const headers = columns.map((column) => column.label)
    const rows = data.map((row) => {
      return columns.map((column) => {
        const raw = row[column.key] as ExportValue
        return column.format ? column.format(raw, row) : raw ?? ''
      })
    })

    return [headers, ...rows]
  }, [columns, data])

  const handleExport = () => {
    if (!exportRows.length) {
      return
    }

    setIsExporting(true)

    try {
      if (format === 'pdf') {
        const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' })
        const margin = 40
        const pageWidth = doc.internal.pageSize.getWidth()
        const pageHeight = doc.internal.pageSize.getHeight()
        const columnCount = exportRows[0].length
        const columnWidth = (pageWidth - margin * 2) / columnCount
        const rowHeight = 20
        let y = margin

        exportRows.forEach((row, rowIndex) => {
          if (y + rowHeight > pageHeight - margin) {
            doc.addPage()
            y = margin
          }

          doc.setFont('helvetica', rowIndex === 0 ? 'bold' : 'normal')

          row.forEach((cell, columnIndex) => {
            const x = margin + columnIndex * columnWidth
            doc.rect(x, y, columnWidth, rowHeight)

            const text = String(cell ?? '')
            const lines = doc.splitTextToSize(text, columnWidth - 8)
            doc.text(lines[0] ?? '', x + 4, y + 14)
          })

          y += rowHeight
        })

        doc.save(filename)
        return
      }

      const worksheet = XLSX.utils.aoa_to_sheet(exportRows)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
      XLSX.writeFile(workbook, filename)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button
      className="flex-1 md:flex-none"
      variant="outline"
      onClick={handleExport}
      disabled={isExporting || !data.length}
    >
      <Download className="w-5 h-5" />
      {isExporting ? 'Exporting...' : label}
    </Button>
  )
}
