import { Document } from "../models/out";
import { Image } from "../models/out";


export async function convertFilesToBase64(files: FileList): Promise<{
  images: Image[]
  documents: Document[]
}> {
  const images: Image[] = []
  const documents: Document[] = []

  for (const file of Array.from(files)) {
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        // Remove the data URL prefix (e.g., "data:image/png;base64,")
        const base64Data = result.split(",")[1]
        resolve(base64Data)
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

    if (file.type.startsWith("image/")) {
      images.push({
        type: "image",
        image_url_base64: base64,
      })
    } else if (file.type === "application/pdf") {
      documents.push({
        type: "pdf_file",
        file_data_base64: base64,
      })
    }
  }

  return { images, documents }
}