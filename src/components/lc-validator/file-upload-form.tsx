"use client"

import type React from "react"

import { useRef } from "react"
import { Upload, X, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createFileList, validateFiles } from "@/types/file-utils"


interface FileUploadFormProps {
  files: FileList | undefined
  isSending: boolean
  isStreaming: boolean
  onFilesChange: (files: FileList | undefined) => void
  onSubmit: (files: FileList) => void
  onRemoveFile: (index: number) => void
}

export function FileUploadForm({
  files,
  isSending,
  isStreaming,
  onFilesChange,
  onSubmit,
  onRemoveFile,
}: FileUploadFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (files && files.length > 0) {
      onSubmit(files)
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const validFiles = validateFiles(event.target.files)

      if (validFiles.length > 0) {
        onFilesChange(createFileList(validFiles))
      } else {
        alert("Please select only PDF, JPG, or PNG files")
      }
    }
  }

  return (
    <div className="border-t bg-card shadow-lg">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {files && files.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {Array.from(files).map((file, index) => (
                <Badge key={index} variant="secondary" className="gap-2 pr-1.5 py-2 text-sm">
                  <FileText className="h-3.5 w-3.5" />
                  <span className="max-w-[250px] truncate">{file.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 rounded-full hover:bg-background/80"
                    onClick={() => onRemoveFile(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3">
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,image/jpeg,image/png,application/pdf"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              className="hidden"
              id="file-upload"
            />

            <Button
              type="button"
              variant="outline"
              className="flex-1 h-14 border-2 border-dashed hover:border-primary hover:bg-primary/5 transition-colors bg-transparent"
              asChild
            >
              <label htmlFor="file-upload" className="cursor-pointer flex items-center justify-center gap-3">
                <Upload className="h-5 w-5" />
                <span className="font-medium">
                  {files && files.length > 0 ? "Add More Documents" : "Upload LC Documents"}
                </span>
              </label>
            </Button>

            <Button
              type="submit"
              size="lg"
              className="h-14 px-8 bg-primary hover:bg-primary/90 shadow-sm"
              disabled={!files || files.length === 0 || isSending || isStreaming}
            >
              <span className="font-semibold">Validate Documents</span>
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Supported formats: PDF, JPG, PNG • Maximum file size: 10MB per file
          </p>
        </form>
      </div>
    </div>
  )
}
