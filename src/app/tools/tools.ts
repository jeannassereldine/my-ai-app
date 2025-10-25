import { StreamEvent } from "../hooks/use_chat";
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


export function parseSSE(chunk: string): StreamEvent | null {
  // Extract event name
  const eventMatch = chunk.match(/event:\s*([^\n]+)/);
  if (!eventMatch) return null;

  const eventName = eventMatch[1].trim();

  // Extract data line
  const dataMatch = chunk.match(/data:\s*([\s\S]*)/); // use [\s\S] to match newlines without /s flag
  if (!dataMatch) return null;

  let rawData = dataMatch[1].trim();

  try {
    // Parse JSON
    const parsedData = JSON.parse(rawData);

    // Map to typed StreamEvent
    if (eventName === "message") {
      // Expect payload to be a string
      return { event: "message", payload: parsedData as string };
    }

    if (eventName === "interrupt") {
      // Expect payload to have question and interruptId
      console.log(parsedData)
      return {
        event: "interrupt",
        payload: parsedData as { question: string; interruptId: string , thread_id:string},
      };
    }
  } catch (err) {
    console.error("Failed to parse SSE data:", rawData, err);
  }

  return null;
}
