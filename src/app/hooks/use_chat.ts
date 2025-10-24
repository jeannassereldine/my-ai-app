import { useState } from "react";
import { AnalyseLCRequest } from "../models/out";


export type StreamEvent =
    | {
        event: "message";
        payload: string;
    }
    | {
        event: "interrupt";
        payload: { question: string; interruptId: string };
    }
    | {
        event: "done";
        payload?: null;
    };
    
function parseSSE(chunk: string): StreamEvent | null {
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
      return {
        event: "interrupt",
        payload: parsedData as { question: string; interruptId: string },
      };
    }
  } catch (err) {
    console.error("Failed to parse SSE data:", rawData, err);
  }

  return null;
}

export function useChat(streamUrl: string) {
    const [events, setEvents] = useState<StreamEvent[]>([]);
    const [isStreaming, setIsStreaming] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const connectToStream = async (response: any) => {
        setIsStreaming(true);
        try {


            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const parts = buffer.split("\n\n");
                buffer = parts.pop() || "";

                for (const chunk of parts) {
                        try {
                            const data: StreamEvent = parseSSE(chunk)!;
                            console.log('event',events)
                            setEvents((prev) => [...prev, data]);

                            // Stop streaming when done event is received
                            if (data.event === "done") {
                                setIsStreaming(false);
                                return;
                            }
                        } catch {
                            console.warn("Failed to parse chunk:");
                        }
                    }
            }
        } catch (err: any) {
            if (err.name !== "AbortError") {
                setError(err.message || "Stream error");
            }
        } finally {
            setIsStreaming(false);
        }
    };

    const sendMessage = async (request: AnalyseLCRequest) => {
        setIsSending(true);
        setError(null);
        setEvents([]); // Clear previous events
        try {
            const response = await fetch(streamUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(request),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            setIsSending(false);
            connectToStream(response);

            return response;
        } catch (err: any) {
            const errorMessage = err.message || "Failed to send message";
            setError(errorMessage);
            setIsSending(false);
            throw new Error(errorMessage);
        }
    };

    const clearEvents = () => {
        setEvents([]);
    };

    const clearError = () => {
        setError(null);
    };

    return {
        events,
        isStreaming,
        isSending,
        error,
        sendMessage,
        clearEvents,
        clearError,
    };
}


