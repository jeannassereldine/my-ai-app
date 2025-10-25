export function validateFiles(files: FileList): File[] {
  const allowedTypes = ["application/pdf", "image/jpeg", "image/png"]
  const allowedExtensions = [".pdf", ".jpg", ".jpeg", ".png"]

  return Array.from(files).filter((file) => {
    const isValidType = allowedTypes.includes(file.type)
    const hasValidExtension = allowedExtensions.some((ext) => file.name.toLowerCase().endsWith(ext))

    if (!isValidType && !hasValidExtension) {
      console.warn(`File "${file.name}" is not a valid PDF, JPG, or PNG`)
      return false
    }
    return true
  })
}

export function createFileList(files: File[]): FileList {
  const dataTransfer = new DataTransfer()
  files.forEach((file) => dataTransfer.items.add(file))
  return dataTransfer.files
}

export function removeFileAtIndex(files: FileList, index: number): FileList | undefined {
  const dt = new DataTransfer()
  Array.from(files).forEach((file, i) => {
    if (i !== index) dt.items.add(file)
  })
  return dt.files.length > 0 ? dt.files : undefined
}
